// Call only with a completion record returned by a SUCCESSFUL app save.
export function createCompletionGate({ledger,isActive,play,onAccepted=()=>{}}){
 const pending=new Set();
 return async function celebrateTask(record){
  if(!record||record.saveStatus!=='saved'||record.outcome!=='completed'||record.essenceId!=='ember'||typeof record.eventId!=='string'||!record.eventId.trim()||typeof record.taskId!=='string'||!record.taskId.trim())return {accepted:false,animated:false,reason:'invalid-or-unsaved'};
  if(!ledger?.has||!ledger?.mark)return {accepted:false,animated:false,reason:'ledger-not-configured'};
  const id=record.eventId;if(pending.has(id))return {accepted:false,animated:false,reason:'duplicate'};pending.add(id);
  try{
   if(await ledger.has(id))return {accepted:false,animated:false,reason:'duplicate'};
   await ledger.mark(id);
   const animated=isActive();if(animated)play();onAccepted(record,animated);
   return {accepted:true,animated};
  }catch(error){return {accepted:false,animated:false,reason:'ledger-write-failed'};}
  finally{pending.delete(id);}
 };
}
