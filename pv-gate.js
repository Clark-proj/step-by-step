// Supply a durable app ledger. Only a successful domain save may call this gate.
export function createCompletionGate({essenceId,ledger,isActive,play,onAccepted=()=>{}}){
  const pending=new Set();
  return async record=>{
    if(!record||record.saveStatus!=='saved'||record.outcome!=='completed'||record.essenceId!==essenceId||typeof record.eventId!=='string'||!record.eventId.trim()||typeof record.taskId!=='string'||!record.taskId.trim())return {accepted:false,animated:false,reason:'invalid-or-unsaved'};
    if(!ledger?.has||!ledger?.mark)return {accepted:false,animated:false,reason:'ledger-not-configured'};
    const id=record.eventId;if(pending.has(id))return {accepted:false,animated:false,reason:'duplicate'};pending.add(id);
    try{
      if(await ledger.has(id))return {accepted:false,animated:false,reason:'duplicate'};
      await ledger.mark(id);
      const animated=isActive();if(animated)play();onAccepted(record,animated);
      return {accepted:true,animated};
    }catch{return {accepted:false,animated:false,reason:'ledger-write-failed'};}
    finally{pending.delete(id);}
  };
}
