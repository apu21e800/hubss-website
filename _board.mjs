
import sharp from "sharp";
const imgs = ["/tmp/final-fieldnotes.png","/tmp/final-products-cards.png","/tmp/final-colours.png","/tmp/final-patterns.png"];
const LBL = ["Field Notes cards — charcoal #20201F","Products grid cards — charcoal","StreetBond colour system (new)","StreetPrint templates (new)"];
const W=1440,H=1000,L=46,G=10;
const cells=[];
for (let i=0;i<4;i++){
  const label=Buffer.from(`<svg width="${W}" height="${L}"><rect width="100%" height="100%" fill="#0A0A0A"/><text x="20" y="31" font-family="Arial" font-size="24" font-weight="bold" fill="#F97316">${LBL[i]}</text></svg>`);
  cells.push(await sharp({create:{width:W,height:H+L,channels:3,background:"#000"}})
    .composite([{input:label,top:0,left:0},{input:await sharp(imgs[i]).toBuffer(),top:L,left:0}]).png().toBuffer());
}
const flat=await sharp({create:{width:W*2+G,height:(H+L)*2+G,channels:3,background:"#333"}})
  .composite([{input:cells[0],top:0,left:0},{input:cells[1],top:0,left:W+G},{input:cells[2],top:H+L+G,left:0},{input:cells[3],top:H+L+G,left:W+G}]).png().toBuffer();
await sharp(flat).resize({width:2200}).jpeg({quality:88}).toFile("/tmp/charcoal-cards-applied.jpg");
console.log("board ok");
