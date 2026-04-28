export function formatPKR(value){
  const n=Number(value||0);
  if(n>=10000000) return `PKR ${(n/10000000).toFixed(n%10000000?2:0)} Crore`;
  if(n>=100000) return `PKR ${(n/100000).toFixed(n%100000?2:0)} Lakh`;
  return `PKR ${n.toLocaleString('en-PK')}`;
}
