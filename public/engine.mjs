export const SUITS=['♣','♦','♥','♠'];
export const LABELS=['High card','Pair','Two pair','Three of a kind','Straight','Flush','Full house','Four of a kind','Straight flush'];
export const rank=c=>2+Math.floor(c/4);
export const suit=c=>c%4;
export const face=c=>({11:'J',12:'Q',13:'K',14:'A'}[rank(c)]||String(rank(c)));
export function evaluate(cards){
 const ranks=cards.map(rank).sort((a,b)=>b-a),groups=[...new Set(ranks)].map(r=>[r,ranks.filter(x=>x===r).length]).sort((a,b)=>b[1]-a[1]||b[0]-a[0]);
 if(cards.length===3){if(groups[0][1]===3)return[3,groups[0][0]];if(groups[0][1]===2)return[1,groups[0][0],groups[1][0]];return[0,...ranks];}
 const flush=cards.every(c=>suit(c)===suit(cards[0]));const uniq=[...new Set(ranks)];let straight=uniq.length===5&&uniq[0]-uniq[4]===4?uniq[0]:0;if(uniq.join(',')==='14,5,4,3,2')straight=5;
 if(flush&&straight)return[8,straight];if(groups[0][1]===4)return[7,groups[0][0],groups[1][0]];if(groups[0][1]===3&&groups[1][1]===2)return[6,groups[0][0],groups[1][0]];if(flush)return[5,...ranks];if(straight)return[4,straight];if(groups[0][1]===3)return[3,groups[0][0],...groups.slice(1).map(g=>g[0])];if(groups[0][1]===2&&groups[1][1]===2)return[2,...groups.slice(0,2).map(g=>g[0]).sort((a,b)=>b-a),groups[2][0]];if(groups[0][1]===2)return[1,groups[0][0],...groups.slice(1).map(g=>g[0])];return[0,...ranks];
}
export function compare(a,b){for(let i=0;i<Math.max(a.length,b.length);i++){const d=(a[i]||0)-(b[i]||0);if(d)return Math.sign(d);}return 0;}
export function validArrangement(hand,rows){
 if(!Array.isArray(rows)||rows.length!==3||rows.some((r,i)=>!Array.isArray(r)||r.length!==[3,5,5][i]))return 'Arrange 3 cards in Front and 5 each in Middle and Back.';
 const all=rows.flat();if(new Set(all).size!==13||all.some(c=>!Number.isInteger(c)||!hand.includes(c)))return 'Use each of your 13 cards exactly once.';
 if(compare(evaluate(rows[2]),evaluate(rows[1]))<0)return 'Your Back must be at least as strong as your Middle.';
 if(compare(evaluate(rows[1]),evaluate(rows[0]))<0)return 'Your Middle must be at least as strong as your Front.';return null;
}
function combinations(cards,n){const out=[];function go(start,arr){if(arr.length===n){out.push(arr);return;}for(let i=start;i<=cards.length-(n-arr.length);i++)go(i+1,[...arr,cards[i]]);}go(0,[]);return out;}
export function suggest(hand){
 const backs=combinations(hand,5).map(cards=>({cards,value:evaluate(cards)})).sort((a,b)=>compare(b.value,a.value));
 for(const back of backs){const left=hand.filter(c=>!back.cards.includes(c));const middles=combinations(left,5).map(cards=>({cards,value:evaluate(cards)})).sort((a,b)=>compare(b.value,a.value));for(const middle of middles){const front=left.filter(c=>!middle.cards.includes(c));if(compare(back.value,middle.value)>=0&&compare(middle.value,evaluate(front))>=0)return[front,middle.cards,back.cards];}}
 throw Error('Could not arrange this hand.');
}
export function scoreRound(players){
 const scores=players.map(()=>0),pairs=[];
 for(let a=0;a<players.length;a++)for(let b=a+1;b<players.length;b++){const rows=players[a].rows.map((r,i)=>compare(evaluate(r),evaluate(players[b].rows[i])));let points=rows.reduce((x,y)=>x+y,0);const scoop=rows.every(x=>x===1)?1:rows.every(x=>x===-1)?-1:0;points+=scoop*3;scores[a]+=points;scores[b]-=points;pairs.push({a,b,rows,points,scoop});}return{scores,pairs};
}
export function shuffle(){const deck=Array.from({length:52},(_,i)=>i);for(let i=51;i>0;i--){const range=i+1,limit=Math.floor(4294967296/range)*range;let v;do{v=crypto.getRandomValues(new Uint32Array(1))[0];}while(v>=limit);const j=v%range;[deck[i],deck[j]]=[deck[j],deck[i]];}return deck;}
