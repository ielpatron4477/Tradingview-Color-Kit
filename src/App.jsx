import { useState, useEffect, useRef } from "react";
const op=(hex,pct)=>hex.slice(0,7)+Math.round(pct*2.55).toString(16).padStart(2,"0");
const P=(O,H,L,M)=>({opens:O,highs:H,lows:L,mids:M});
const CAT_META={
  CLASSIC:{label:"CLASSIC",dot:"#888880"},VIBE:{label:"VIBE",dot:"#9060d8"},
  NEON:{label:"NEON",dot:"#00d880"},MINIMAL:{label:"MIN",dot:"#888888"},
  DEGEN:{label:"DEGEN",dot:"#ff6000"},PRO:{label:"PRO",dot:"#b8a870"},
  MEME:{label:"MEME",dot:"#f4b400"},CYBER:{label:"CYBER",dot:"#00ffcc"},
  AURA:{label:"AURA",dot:"#b080ff"},FREAK:{label:"FREAK",dot:"#ff4080"},
  GOTH:{label:"GOTH",dot:"#c060a0"},CREATE:{label:"ART",dot:"#ff8020"},
  FANTASY:{label:"FAE",dot:"#80d0a0"},ANIME:{label:"ANIME",dot:"#ff70a0"},
  GUM:{label:"GUM",dot:"#ff60c0"},FREE:{label:"FREE",dot:"#a040ff"},
};
const Th=(id,cat,name,tag,bg,sf,tx,ac,up,dn,wk,gr,match,vivid)=>({id,cat,name,tag,bg,sf,tx,ac,up,dn,wk,gr,match,vivid,chart:{background:{hex:bg,label:"Background"},up:{hex:up,label:"Up Candle"},down:{hex:dn,label:"Down Candle"},wick:{hex:wk,label:"Wick / Border"},textColor:{hex:tx,label:"Text / Labels"},grid:{hex:gr,label:"Grid Lines"}}});
const THEMES=[
// CLASSIC
Th("ember","CLASSIC","EMBER","Warm · Earthen · Timeless","#d6c2b8","#e8d8ce","#3d2b1f","#a67863","#f0e5de","#a67863","#3d2b1f","#c9b0a4",P("#b89020","#c04535","#2e7055","#7055a0"),P("#f5c518","#e83030","#28c860","#9030d0")),
Th("dusk","CLASSIC","DUSK","Moody · Violet · Cinematic","#1a1625","#231d33","#e2d9f3","#8b5cf6","#c8b8e8","#8b5cf6","#e2d9f3","#2d2540",P("#c8b830","#c85878","#38a878","#58a8c8"),P("#eadf50","#f06868","#4cca90","#48c0e8")),
Th("frost","CLASSIC","FROST","Crisp · Arctic · Pure","#e8f0f5","#d8e8f0","#1c3d50","#5b8fa8","#ffffff","#5b8fa8","#1c3d50","#cddae3",P("#a07018","#a82828","#186e38","#5828a0"),P("#d4a810","#e82020","#18c050","#7020d0")),
Th("obsidian","CLASSIC","OBSIDIAN","Dark · Sharp · Fearless","#0d0d0d","#1a1a1a","#f0f0f0","#e0e0e0","#c8f5c8","#c8281e","#f0f0f0","#1f1f1f",P("#c0a820","#c83838","#38b870","#7838d0"),P("#f0d020","#f03030","#30e878","#a030f0")),
Th("sage","CLASSIC","SAGE","Natural · Grounded · Still","#c8d5c0","#d8e5d0","#2a3d22","#5e7a52","#eef4e8","#5e7a52","#2a3d22","#b5c6aa",P("#a09018","#a83828","#186838","#504880"),P("#d4b010","#e02828","#18c048","#7028c0")),
Th("sand","CLASSIC","SAND","Arid · Golden · Stripped","#e8dcc8","#f0e8d0","#3d2e10","#c8962a","#faf5e8","#c8962a","#3d2e10","#d8ccb0",P("#a8a018","#a03018","#185030","#403888"),P("#e0d010","#e02020","#18c038","#6028c0")),
Th("midnight","CLASSIC","MIDNIGHT","Deep · Indigo · Nocturnal","#10121f","#181b2e","#d4d8f8","#4f6ef7","#b8c4f8","#4f6ef7","#d4d8f8","#20243a",P("#c8b020","#c83838","#38b878","#d07828"),P("#f0d840","#f05050","#40d090","#f09040")),
Th("rose","CLASSIC","ROSE","Soft · Petal · Editorial","#f5e8ec","#fdf0f3","#4a1a28","#c96080","#fff0f4","#c96080","#4a1a28","#e8d0d8",P("#a88818","#982038","#187048","#402888"),P("#e0c010","#d02040","#20b050","#6028c0")),
Th("slate","CLASSIC","SLATE","Neutral · Institutional · Sharp","#1e2129","#272c36","#e8eaf0","#7a8fa8","#c8d4e0","#7a8fa8","#e8eaf0","#30353f",P("#c0a028","#b83838","#287880","#7828a8"),P("#e8d030","#e03030","#28b0b0","#a030e0")),
Th("copper","CLASSIC","COPPER","Molten · Industrial · Raw","#1a1208","#251b0a","#f0d890","#c87820","#f0d890","#c87820","#f0d890","#302010",P("#a0c018","#c02818","#189050","#4830a0"),P("#c8e020","#f02020","#20b060","#7030d0")),
Th("ocean","CLASSIC","OCEAN","Deep · Teal · Flowing","#0a1e28","#0e2a38","#c8f0f0","#20a8a8","#c8f0f0","#20a8a8","#c8f0f0","#142e3e",P("#c0b818","#c85038","#40c870","#8830c8"),P("#e8e020","#e85030","#30e870","#b030e8")),
Th("noir","CLASSIC","NOIR","Monochrome · Stark · Decisive","#f8f8f6","#efefed","#101010","#303030","#101010","#909090","#101010","#e0e0de",P("#706020","#a82828","#186030","#402880"),P("#d4b820","#d02828","#28a848","#6820c8")),
Th("crimson","CLASSIC","CRIMSON","Bold · Blood · Decisive","#180808","#220c0c","#f8d8d8","#d82020","#f8d8d8","#d82020","#f8d8d8","#280e0e",P("#c0c038","#880808","#087808","#300890"),P("#e8e030","#c80808","#08c030","#5008d0")),
Th("forest","CLASSIC","FOREST","Ancient · Dark Green · Dense","#0c180a","#122010","#d0e8c8","#2e7820","#d0e8c8","#2e7820","#d0e8c8","#182a14",P("#b8a818","#c82818","#28c860","#6818b0"),P("#e8d018","#f02020","#30f078","#9020e8")),
Th("lavender","CLASSIC","LAVENDER","Gentle · Mist · Dreamy","#ede8f8","#f5f0ff","#2a1a4a","#8060c0","#f0e8ff","#8060c0","#2a1a4a","#d8d0ee",P("#989010","#a82850","#188888","#503868"),P("#d4c010","#d02050","#20b090","#6830b0")),
Th("ash","CLASSIC","ASH","Muted · Taupe · Weathered","#d8d0c8","#e4dcd4","#2c2420","#806858","#f0e8e0","#806858","#2c2420","#c4b8b0",P("#a89028","#984028","#286858","#403868"),P("#d4b820","#c03028","#28a068","#583898")),
Th("cobalt","CLASSIC","COBALT","Electric · Technical · Focused","#080e1e","#0c1428","#c8daf8","#1848d8","#c8daf8","#1848d8","#c8daf8","#101a30",P("#d0c038","#c03838","#38c888","#c038a0"),P("#f0e030","#f02020","#30f0a0","#f020d0")),
Th("ivory","CLASSIC","IVORY","Cream · Quiet · Refined","#f8f4ec","#fffdf8","#2a2418","#9a8060","#fffdf8","#9a8060","#2a2418","#e8e0d0",P("#988818","#983018","#186840","#502878"),P("#d0b810","#c02018","#20a850","#7020a8")),
Th("terra","CLASSIC","TERRA","Terracotta · Rust · Sunbaked","#ead0b0","#f0dcc0","#3a1808","#8c4820","#fcecd8","#8c4820","#3a1808","#d8c098",P("#988010","#882010","#145038","#382878"),P("#d0b010","#d02010","#18c040","#6020c0")),
Th("smoke","CLASSIC","SMOKE","Cool · Haze · Cinematic","#141c24","#1c2830","#c0ccd8","#708090","#c0ccd8","#708090","#c0ccd8","#202c38",P("#c8b828","#b84848","#40a880","#7840b8"),P("#e8d048","#e03030","#30d890","#a030e8")),
Th("honey","CLASSIC","HONEY","Amber · Warm · Saturated","#f0e0a8","#f8ecc0","#2c1808","#c07820","#fff8e0","#c07820","#2c1808","#e0d090",P("#785010","#983020","#186038","#402890"),P("#c89010","#e02828","#18b048","#6028d0")),
Th("jade","CLASSIC","JADE","Dark · Jungle · Primordial","#082018","#0c2c1e","#c8ecd0","#20a060","#c8ecd0","#20a060","#c8ecd0","#102818",P("#c0b038","#c83838","#38d888","#6838c8"),P("#e8d020","#f03030","#30f898","#9028f0")),
Th("steel","CLASSIC","STEEL","Cold · Metallic · Technical","#101820","#182030","#c0d0e0","#4068a0","#c0d0e0","#4068a0","#c0d0e0","#182028",P("#c0a848","#b83858","#38a880","#7840b0"),P("#e8d030","#d02050","#30b0d0","#a030e8")),
Th("blush","CLASSIC","BLUSH","Delicate · Cream · Feminine","#f8ecec","#fff0f0","#2c1418","#c08090","#fff0f4","#c08090","#2c1418","#e8d0d8",P("#886018","#982040","#185850","#402890"),P("#c89810","#d82040","#18a060","#6028d0")),
Th("dune","CLASSIC","DUNE","Desert · Minimal · Cinematic","#d8c8a8","#e8d8b8","#2a1e08","#a08040","#f0e0c8","#a08040","#2a1e08","#c8b888",P("#a07818","#a03020","#185840","#383878"),P("#c8a810","#d02820","#18a838","#5020b0")),
Th("void","CLASSIC","VOID","Dark · Neon · Infinite","#040408","#080c12","#00e8c8","#00c8a8","#00e8c8","#e84060","#00c8a8","#0c1820",P("#d0c030","#d03858","#18c890","#8030c0"),P("#f0f030","#ff3060","#30ff90","#c030ff")),
Th("parchment","CLASSIC","PARCHMENT","Aged · Paper · Editorial","#f0e8d0","#f8f0e0","#2c1808","#8c5828","#f8f0e0","#8c5828","#2c1808","#e0d0b0",P("#906818","#902010","#146030","#383078"),P("#d09010","#d02010","#18b040","#5820c0")),
Th("arctic","CLASSIC","ARCTIC","Ice · Precision · Clinical","#e0f0f8","#f0f8ff","#083060","#2868c8","#ffffff","#2868c8","#083060","#c8e0f0",P("#a07818","#c82020","#186838","#5820a0"),P("#e8d010","#e82020","#20c860","#8020e8")),
Th("bordeaux","CLASSIC","BORDEAUX","Wine · Deep · Luxurious","#1a0810","#240c18","#f0d0d8","#c04870","#f0d0d8","#c04870","#f0d0d8","#2c1020",P("#c09018","#a83860","#188850","#5828c0"),P("#f0d020","#f03060","#20e870","#8820f0")),
Th("moss","CLASSIC","MOSS","Dark · Earthy · Organic","#1a2010","#20281a","#c8d8a8","#788040","#c8d8a8","#788040","#c8d8a8","#242c18",P("#a89820","#c02818","#38b860","#6030a8"),P("#e0d018","#e02818","#30e878","#8828e8")),
Th("chrome","CLASSIC","CHROME","Metallic · Graphite · Precise","#2a2c30","#343638","#e8eaec","#a0a8b0","#e8eaec","#a0a8b0","#e8eaec","#383c40",P("#c8b030","#c03838","#388090","#7038b0"),P("#f0d020","#f02020","#20c8b0","#c020f0")),
Th("sakura","CLASSIC","SAKURA","Blossom · Delicate · Japanese","#f8e8f0","#fff0f8","#2a0820","#d06090","#fff0f8","#d06090","#2a0820","#e8d0e0",P("#a87818","#b02048","#187858","#402888"),P("#e0c010","#e81848","#18b068","#7018d0")),
// VIBE
Th("nocturne","VIBE","NOCTURNE","Midnight · Deep Blue · 2AM","#060a14","#0a0e1c","#a8bcd8","#6080b0","#8ab4d0","#e87880","#8090b0","#0c1022",P("#a09028","#c05870","#38889a","#6040a0"),P("#e0c838","#f06888","#30b8d8","#9040d8")),
Th("lantern","VIBE","LANTERN","Warm Glow · Amber · Lo-Fi","#100a04","#1a1208","#f0c870","#d08030","#f0d898","#c05818","#d08030","#1c1408",P("#c07820","#b84820","#1e8050","#4c3490"),P("#f0c828","#f05828","#28d868","#8830e8")),
Th("synthwave","VIBE","SYNTHWAVE","Retro · 80s · Neon Drive","#0d0618","#160a28","#e890d8","#c030b0","#40d8c8","#e83888","#9060c0","#1a0c30",P("#b8a828","#d03880","#28c0b0","#7030b8"),P("#f8e030","#ff2890","#00f0d0","#c028f8")),
Th("twilight","VIBE","TWILIGHT","Dusk · Purple · Last Light","#0e0c1e","#140e28","#c8b8f8","#7850e8","#b8a0f0","#e870a8","#9060d0","#1a1430",P("#b0a028","#c06090","#4890b8","#6040a8"),P("#e8d030","#f058a0","#50b8e8","#9050f8")),
// NEON
Th("cyber","NEON","CYBER","Electric · Neon · Cyberpunk","#020814","#04101e","#00e8d8","#00c8b8","#00e8d8","#f040a8","#00c8b8","#081018",P("#d0c830","#e04090","#00c890","#9030d0"),P("#ffee00","#ff30a0","#00ff90","#b830ff")),
Th("aurora","NEON","AURORA","Northern Lights · Spectral","#040c10","#081418","#a0f0e0","#30d0b0","#a0f0e0","#f06898","#30d0b0","#081c20",P("#d8c030","#e06088","#30c898","#8830c8"),P("#f8e030","#ff5090","#20f0a0","#c030f8")),
Th("plasma","NEON","PLASMA","Pink · Cyan · Plasma Globe","#080412","#100620","#f8c0f8","#e040d0","#40f8f0","#f040a0","#e040d0","#0c0618",P("#c8b028","#e040a0","#30d8c0","#9030d0"),P("#f8f020","#ff30b0","#20f8e8","#e020f8")),
Th("laser","NEON","LASER","Green · Precise · Laser Beam","#020802","#041004","#80ff80","#40e040","#80ff80","#ff4040","#40e040","#041004",P("#c0e020","#e04040","#40e040","#6020c0"),P("#e0ff20","#ff2020","#80ff80","#a020f8")),
// MINIMAL
Th("ink","MINIMAL","INK","Editorial · Swiss · Ultra Minimal","#f2f0ec","#fafaf8","#141414","#282820","#c8c4bc","#141414","#141414","#d8d6d0",P("#806020","#b02020","#206040","#402880"),P("#c09030","#d82020","#20a050","#6030c0")),
Th("graphite","MINIMAL","GRAPHITE","Institutional · Hedge Fund","#1c1e20","#242628","#e0e2e4","#7a8290","#d0d4d8","#5a6270","#e0e2e4","#282a2c",P("#c0a828","#b03838","#389090","#7838b0"),P("#e8c830","#d83030","#30c0a8","#a030d0")),
// DEGEN
Th("matrix","DEGEN","MATRIX","Hacker · Digital Rain · Alpha","#010c01","#021802","#00ff41","#00c832","#00ff41","#a00820","#00c832","#041404",P("#80c020","#c03818","#00c832","#6020a0"),P("#d0ff10","#ff2020","#00ff41","#b020ff")),
Th("bloodmoon","DEGEN","BLOOD MOON","Eclipse · Ominous · Bleeds","#0c0404","#180808","#f08060","#e04020","#f09040","#900808","#d06030","#140808",P("#c08020","#b02010","#186040","#601080"),P("#ffa020","#ff2010","#20d060","#c010e0")),
Th("sol","DEGEN","SOL","Solana · DeFi · Web3 Trenches","#080412","#100820","#c8a0ff","#9945ff","#14f195","#ff4060","#9945ff","#120818",P("#b0a020","#c03060","#14c878","#7030c8"),P("#f0e020","#ff3060","#14f195","#9945ff")),
Th("uranium","DEGEN","URANIUM","Radioactive · Toxic · Ape In","#040804","#081008","#a8e820","#80d000","#c8ff20","#e82020","#80d000","#0c1408",P("#a0d010","#c82020","#80d000","#4020b0"),P("#e0ff20","#ff2020","#40ff80","#a030ff")),
Th("velvet","DEGEN","VELVET","Whale · Profit · Luxury","#0e0810","#160c18","#d4a8e0","#a050c8","#d4b840","#c84070","#a050c8","#180e1a",P("#c8a830","#c04068","#388878","#8040a8"),P("#f0c828","#f040a0","#40e8b0","#c040f8")),
Th("bitcoin","DEGEN","BITCOIN","OG · Maxi · Orange Pill","#100800","#1c1000","#f7931a","#f7931a","#f7931a","#e82020","#c07010","#1c1200",P("#d08018","#c82020","#188040","#502888"),P("#f7931a","#ff2020","#20e060","#b020f8")),
Th("pepe","DEGEN","PEPE","Meme Royalty · King Frog","#071006","#0c1a0a","#5ed840","#46c828","#5ed840","#e82828","#46c828","#0e1c0c",P("#b0c018","#c82020","#46c828","#5820c0"),P("#e0f020","#ff2020","#5ed840","#a818f8")),
Th("ghost","DEGEN","GHOST","Anon · No PFP · Real Alpha","#08080e","#0e0e18","#c8c8e8","#8888c0","#e0e0f8","#606090","#9090c8","#111118",P("#a0a028","#806090","#4878a8","#5858a8"),P("#e8d040","#c040e0","#4090e8","#9040f8")),
Th("fire","DEGEN","FIRE","Bull Run · Euphoria · So Back","#100400","#1c0800","#ff8030","#ff6020","#ffb040","#e82010","#ff6020","#1a0800",P("#d07018","#d02010","#18a050","#5020c0"),P("#ffb040","#ff2010","#20e060","#c010f0")),
Th("anon","DEGEN","ANON","Shadow · Encrypted · No Trust","#040408","#08080e","#9090b8","#5050a0","#7070b0","#905050","#6060a0","#080810",P("#808028","#905050","#3878a0","#5050a0"),P("#d8d040","#d04040","#40a0d8","#8840e0")),
Th("eth","DEGEN","ETH","Ethereum · Silver · Builder","#0c0e18","#121828","#c0d0f8","#627eea","#c0d8f0","#e87060","#627eea","#161c2e",P("#c8b828","#c05060","#4080c0","#8040d0"),P("#f0d820","#f05060","#40a0f0","#a040f0")),
Th("pump","DEGEN","PUMP","Everything Green · WAGMI","#041408","#081e0c","#40ff80","#20e860","#40ff80","#e03020","#20c050","#0c1e10",P("#c0e020","#c02828","#20e060","#6028c0"),P("#e0ff20","#ff2828","#40ff80","#a028f8")),
// PRO
Th("onyx","PRO","ONYX","Luxury · Premium · Authority","#080808","#141414","#f8f8f8","#d8d8d8","#c8e8c8","#e8c8c8","#909090","#1c1c1c",P("#c8a830","#c03030","#208858","#5030a8"),P("#f0d040","#f03030","#30d870","#9030f0")),
Th("blueprint","PRO","BLUEPRINT","Institutional · Navy · Bank Tier","#060e18","#0c1828","#d8e8f8","#4080c0","#c0d8f0","#e08080","#6090c0","#0e1c2c",P("#c0a030","#d07070","#4090d0","#7040b0"),P("#e8d030","#e83030","#30b0f0","#a030e0")),
Th("carbon","PRO","CARBON","Newsletter · Dark Tech · Research","#181c20","#242830","#c8d0d8","#6080a0","#c0d0c8","#c06060","#8090a0","#222830",P("#b0a030","#c06060","#3890b0","#6840a0"),P("#e0d030","#e04040","#30c0d0","#9040e0")),
Th("linen","PRO","LINEN","Editorial · Research · Publication","#f4f0e8","#faf8f4","#1c1810","#3c3020","#dce8dc","#1c1810","#1c1810","#e4dfd4",P("#7a6010","#982828","#187040","#402870"),P("#c09018","#c82828","#20a050","#6020a0")),
Th("zinc","PRO","ZINC","Authority · Clean · No Noise","#eaeaec","#f4f4f6","#141618","#404448","#d0d8d0","#141618","#141618","#d8d8dc",P("#706018","#982828","#186840","#402878"),P("#a08820","#c02828","#20a048","#5820b0")),
Th("goldleaf","PRO","GOLD LEAF","Wealth · Prestige · Eye-Catching","#141008","#201808","#f0d880","#d4a830","#f0d880","#e04040","#d4a830","#1c1808",P("#d4a830","#e04040","#308860","#5830a0"),P("#f8d820","#f03030","#30c870","#9830f0")),
Th("royal","PRO","ROYAL","Deep Navy · Gold · Credibility","#080c18","#0e1428","#e8d898","#c8a030","#e8d898","#c04060","#c8a030","#0c1220",P("#c8a030","#c04060","#208860","#5028a0"),P("#f8c830","#f04060","#30d870","#a028f8")),
// MEME
Th("doge","MEME","DOGE","Much Wow · Very Gains · Such Moon","#1a1404","#241c08","#f4c820","#d4a010","#f4d828","#e04020","#d4a010","#201808",P("#c49010","#c03020","#18a040","#4820a0"),P("#f4c820","#ff3020","#20d058","#8820e8")),
Th("wif","MEME","WIF","Dog With Hat · Cozy · 1000x","#1c1008","#281810","#e8a060","#d07030","#e8b068","#b03020","#d07030","#241808",P("#c09018","#b03020","#186840","#402878"),P("#f0a830","#f02020","#20c050","#8828e8")),
Th("bonk","MEME","BONK","Chaotic · Energetic · APE NOW","#180808","#240c0c","#ff7030","#ff4020","#ff8040","#c01010","#ff4020","#200c0c",P("#e08020","#c01010","#188040","#501888"),P("#ff9030","#ff1010","#20d060","#9018f0")),
// CYBER
Th("neonnoir","CYBER","NEON NOIR","Rain · City Lights · Blade Runner","#060810","#0c0e18","#e0d0f0","#ff30a0","#30f0c0","#ff30a0","#c050e0","#080c14",P("#c0b030","#e030a0","#30c0b0","#8030e0"),P("#f8f020","#ff10a0","#10f0d0","#c010f8")),
Th("chromepunk","CYBER","CHROME PUNK","Holographic · Future Tech","#0a0c0e","#121618","#d0e0e8","#80a0b8","#d0e8f8","#e84870","#90b0c8","#141820",P("#b0c030","#e84870","#48a0c0","#9040c0"),P("#e8f030","#ff4070","#40c8f8","#d040f8")),
// AURA
Th("purpleaura","AURA","PURPLE AURA","Spiritual · Mystical · Energy Field","#100c1c","#180e28","#d8c0f8","#a068e8","#d8c0f8","#e070a8","#a068e8","#1c1230",P("#b0a028","#c068a8","#5090c0","#8048d0"),P("#e8d040","#e060b0","#50b8e8","#c048f8")),
Th("goldenaura","AURA","GOLDEN AURA","Abundance · Wealth · Golden Light","#100c04","#1c1408","#f8d870","#e0a820","#f8d870","#d86020","#e0a820","#181008",P("#d0a018","#d06020","#18a050","#6028a0"),P("#f8e020","#f07020","#20d870","#a020f0")),
// FREAK
Th("acid","FREAK","ACID","Psychedelic · RGB Chaos · No Rules","#080408","#100810","#ff80ff","#ff40ff","#80ffff","#ffff40","#ff80ff","#100810",P("#d030d0","#c0c020","#30c0c0","#c030a0"),P("#ff40ff","#ffff20","#20ffff","#ff20a0")),
Th("glitch","FREAK","GLITCH","Corrupted · System Error · Exploit","#040408","#080812","#ff0088","#00ffcc","#00ffcc","#ff0088","#00ffcc","#040410",P("#c0c020","#d00070","#00c898","#7000d0"),P("#f8f820","#ff0080","#00ffd0","#a000ff")),
// GOTH
Th("mortis","GOTH","MORTIS","Cemetery · Blood Red · Dark Romance","#080204","#100408","#e0a0a8","#b02030","#e0a8b0","#800010","#b02030","#120608",P("#a88020","#b02030","#186030","#501060"),P("#e8c030","#e02030","#20a860","#9010c0")),
Th("eclipse","GOTH","ECLIPSE","Dark Purple · Silver · Nocturnal","#080612","#0e0c1e","#c0b0d8","#806898","#c0b0d8","#704858","#9080b0","#100c1c",P("#a09028","#906070","#3878a0","#5848a0"),P("#e8d040","#c06080","#40a8e0","#9048f0")),
// CREATE
Th("canvas","CREATE","CANVAS","Artist · Studio · Palette Vibes","#f0e8d8","#f8f0e8","#201808","#c86020","#e8d8c0","#201808","#201808","#e0d8c8",P("#a07018","#b82818","#186840","#402870"),P("#d0a020","#d02818","#20a050","#6020b0")),
Th("spectrum","CREATE","SPECTRUM","Rainbow · Full Palette · Creative","#0c0810","#141020","#f8d0f0","#d040a0","#a8f040","#e04080","#d040a0","#100c18",P("#c0b030","#e04080","#80c830","#9030c0"),P("#f0e030","#f03080","#a0f030","#d030f0")),
// FANTASY
Th("dragon","FANTASY","DRAGON","Fire · Mythical · Ancient Power","#0c0804","#18100a","#f0c868","#d04010","#f0c868","#900808","#d04010","#14100a",P("#c89018","#c03010","#186840","#5018a0"),P("#f8c820","#f02010","#20d060","#9018f0")),
Th("elven","FANTASY","ELVEN","Forest · Mystical · Woodland","#0a1410","#101e18","#c8e8c0","#60c880","#c8e8c0","#d86888","#60c880","#0e1c14",P("#b0c018","#c06080","#60c880","#6040a8"),P("#e0f020","#f06090","#60f0a0","#9040f0")),
// ANIME
Th("shohen","ANIME","SHŌNEN","Power Up · Battle Energy · FIGHT!","#0c0e1c","#121428","#d0e0f8","#ff8020","#d0e0f8","#ff4020","#ff8020","#101628",P("#d07820","#f04020","#4088d0","#8040d0"),P("#f89820","#ff3020","#40b0f0","#c040f0")),
Th("sakurabloom","ANIME","SAKURA BLOOM","Ghibli · Soft · Ethereal Blossom","#1c0c18","#281020","#f8d0e8","#e870a8","#f8d8e8","#703060","#e870a8","#241020",P("#c09818","#c03060","#188070","#602890"),P("#f8e020","#f03070","#20c0a0","#a020d8")),
Th("darkanime","ANIME","DARK ANIME","Demon Slayer · Titan · Intense","#080c10","#0e1218","#d0c8e0","#8070d0","#c8c0e0","#e04040","#8070d0","#0c1016",P("#a09828","#c04040","#5080b8","#6050b0"),P("#e8d830","#f02020","#50a8f0","#a050f8")),
Th("mecha","ANIME","MECHA","Gundam · Eva · Steel Colossus","#0e1018","#161a24","#c8d8e8","#5090c8","#c8d8e8","#e84020","#6090b0","#12161e",P("#b0a830","#e04020","#5090c8","#7040a8"),P("#e8d830","#f03020","#50b8f0","#c040e8")),
Th("retroanime","ANIME","RETRO ANIME","VHS · 80s OVA · City Hunter","#180810","#241018","#f8c0d8","#e84080","#f8c0d8","#304890","#e84080","#200c18",P("#c09020","#d04080","#304890","#7020b0"),P("#f8d020","#f04090","#4060f0","#c020f8")),
// GUM
Th("cottoncandy","GUM","COTTON CANDY","Pastel · Soft · Sweet Dreams","#f8eef8","#fff4ff","#401838","#d060b0","#c0e8f8","#f880c0","#d060b0","#eee0ee",P("#c08818","#d06090","#4098c0","#8040b0"),P("#f8d020","#f040a0","#40c0f0","#c040e8")),
Th("bubblegumpop","GUM","BUBBLEGUM POP","Hot Pink · Pop Art · Barbie Mode","#1a0818","#280e24","#ff90e0","#ff40c0","#40f8d8","#ff40c0","#ff90e0","#200c1e",P("#d0b030","#e040c0","#30d8b0","#a030d0"),P("#f8f030","#ff30c0","#30f8d0","#f030f8")),
// FREE
Th("acidtrip","FREE","ACID TRIP","No Rules · Psychedelic · Dimension X","#060408","#0c0810","#c0ff40","#8040ff","#c0ff40","#ff4080","#8040ff","#080610",P("#a8c028","#e04080","#80e028","#6030e0"),P("#c8ff20","#ff2080","#a0ff20","#8020ff")),
Th("disco","FREE","DISCO","70s Fever · Gold · Saturday Night","#0c0810","#141018","#f8d840","#e0a020","#f8d840","#e04080","#e0a020","#100c14",P("#d0a020","#d04080","#40b070","#7020c0"),P("#f8d820","#f02080","#40f080","#c020f0")),
// ── PHANTOM SERIES — for the shadow operators ─────────────────────────────
Th("phantom","GOTH","PHANTOM","Noir · Sacred · No Face · Absolute Dark",
  "#040404","#080808","#d0c8be","#a09888","#e8e0d4","#1a1612","#706860","#0c0c0c",
  P("#987830","#904030","#286840","#505058"),
  P("#c8a840","#c04030","#30a860","#8070a0")),

Th("oracle","GOTH","ORACLE","Ancient · Grain · Prophetic Vision",
  "#020202","#060604","#c8be9e","#907850","#d4c8a8","#141008","#585040","#080806",
  P("#907040","#883020","#206438","#484050"),
  P("#c0a030","#c03020","#20b050","#7050c0")),

Th("specter","GOTH","SPECTER","Halftone · Monochrome · Ghost Signal",
  "#060608","#0a0a0c","#c0c0c8","#808090","#d8d8e0","#101014","#484850","#0e0e10",
  P("#a09820","#904050","#308080","#504880"),
  P("#d8c820","#d03050","#30b0b0","#8050d0")),

];
const SBGS={synthwave:"radial-gradient(ellipse at top left,#200838 0%,#0d0618 60%)",twilight:"radial-gradient(ellipse at top right,#1c1440 0%,#0e0c1e 60%)",matrix:"radial-gradient(ellipse at bottom,#031803 0%,#010c01 65%)",bloodmoon:"radial-gradient(ellipse at top,#1c0404 0%,#0c0404 70%)",sol:"radial-gradient(135deg,#140a28 0%,#080412 65%)",uranium:"radial-gradient(ellipse at top,#081508 0%,#040804 70%)",velvet:"radial-gradient(ellipse at top left,#1c0e24 0%,#0e0810 60%)",bitcoin:"radial-gradient(ellipse at top,#1e1000 0%,#100800 70%)",pepe:"radial-gradient(ellipse at bottom,#0a1a08 0%,#071006 65%)",ghost:"radial-gradient(ellipse at center,#0e0e18 0%,#08080e 70%)",fire:"radial-gradient(ellipse at top,#1c0600 0%,#100400 70%)",neonnoir:"radial-gradient(ellipse at top,#1a0820 0%,#060810 70%)",plasma:"radial-gradient(ellipse at top left,#200818 0%,#080412 60%)",goldleaf:"radial-gradient(ellipse at top,#1e1808 0%,#141008 65%)",royal:"radial-gradient(ellipse at top left,#0c1428 0%,#080c18 60%)",purpleaura:"radial-gradient(ellipse at center,#180e28 0%,#100c1c 70%)",goldenaura:"radial-gradient(ellipse at top,#1c1408 0%,#100c04 70%)",dragon:"radial-gradient(ellipse at top,#1c1004 0%,#0c0804 70%)",shohen:"radial-gradient(ellipse at top left,#0c1030 0%,#0c0e1c 65%)",bubblegumpop:"radial-gradient(ellipse at top,#280c30 0%,#1a0818 65%)",acidtrip:"radial-gradient(135deg,#0c0418 0%,#060408 100%)",acid:"radial-gradient(135deg,#100618 0%,#080408 100%)",glitch:"radial-gradient(ellipse at center,#080818 0%,#040408 70%)",disco:"radial-gradient(ellipse at top,#1a0c0c 0%,#0c0810 70%)",mortis:"radial-gradient(ellipse at top,#140408 0%,#080204 70%)",cottoncandy:"linear-gradient(135deg,#fce8fc 0%,#f8eef8 100%)",onyx:"linear-gradient(180deg,#0c0c0c 0%,#080808 100%)",blueprint:"linear-gradient(135deg,#080e18 0%,#060e18 100%)"};
const SGLO={matrix:"0 0 80px #00c83240",bloodmoon:"0 0 80px #e0402040",sol:"0 0 80px #9945ff40",uranium:"0 0 80px #80d00040",velvet:"0 0 80px #a050c840",bitcoin:"0 0 80px #f7931a40",pepe:"0 0 80px #46c82840",ghost:"0 0 60px #8888c030",fire:"0 0 80px #ff602040",cyber:"0 0 70px #00c8b840",aurora:"0 0 70px #30d0b040",plasma:"0 0 70px #e040d040",laser:"0 0 70px #40e04050",neonnoir:"0 0 70px #ff30a040",purpleaura:"0 0 60px #a068e840",goldenaura:"0 0 60px #e0a82040",acid:"0 0 60px #ff40ff30",glitch:"0 0 70px #00ffcc30",dragon:"0 0 70px #d0401030",shohen:"0 0 60px #ff802030",bubblegumpop:"0 0 70px #ff40c040",acidtrip:"0 0 60px #8040ff40",disco:"0 0 50px #e0a02030",doge:"0 0 50px #d4a01030",pump:"0 0 60px #20e86030",eth:"0 0 50px #627eea30",chromepunk:"0 0 50px #80a0b830",mortis:"0 0 50px #b0203030",cottoncandy:"0 0 40px #d060b020",goldleaf:"0 0 60px #d4a83030",royal:"0 0 50px #c8a03030"};

const PHANTOM_SBGS={
  phantom:"radial-gradient(ellipse at top,#0a0804 0%,#040404 70%)",
  oracle:"radial-gradient(ellipse at center,#080604 0%,#020202 70%)",
  specter:"radial-gradient(ellipse at top left,#0a0a10 0%,#060608 70%)",
};
const PHANTOM_SGLO={
  phantom:"0 0 60px rgba(160,152,136,0.12)",
  oracle:"0 0 50px rgba(144,120,80,0.10)",
  specter:"0 0 60px rgba(128,128,144,0.12)",
};

const PAL={match:{icon:"◉",label:"MATCH",desc:"Blends with chart"},vivid:{icon:"◈",label:"VIVID",desc:"Max contrast for content"}};

function tools(O,H,L,M,A){return{
  fib:[{level:"0",hex:L},{level:"0.236",hex:op(L,60)},{level:"0.382",hex:op(L,45)},{level:"0.5",hex:M},{level:"0.618",hex:A},{level:"0.705",hex:op(H,55)},{level:"0.786",hex:op(H,75)},{level:"1",hex:H},{level:"1.618",hex:op(H,82)}],
  lines:{trend:A,ray:op(A,74),hline:op(A,56),vline:op(A,44)},
  zones:{support:op(L,28),resistance:op(H,28),bull:op(L,18),bear:op(H,18),fvg:op(M,24),orderBlock:op(A,20),equilibrium:op(M,20),premium:op(H,14),discount:op(L,14)},
  mas:{ma1:O,ma2:A,ma3:M,ma4:L,ma5:H},
  channels:{outerBand:A,midline:op(A,60),fill:op(A,9),extended:op(A,44)},
  vwap:{vwap:O,anchor:M,band1pos:op(H,74),band1neg:op(L,74),band2pos:op(H,54),band2neg:op(L,54),band3pos:op(H,36),band3neg:op(L,36)},
  pivots:{r3:H,r2:op(H,80),r1:op(H,64),pp:O,s1:op(L,64),s2:op(L,80),s3:L,weekly:op(A,50),monthly:op(A,34)},
  fractals:{fractalUp:H,fractalDown:L,fractalZone:op(M,18)},
  volProfile:{poc:O,valueArea:op(M,24),vah:H,val:L,hvn:A,lvn:op(A,38)},
  indicators:{rsi:A,macd:O,macdSig:M,histBull:L,histBear:H,bbUp:op(H,62),bbDn:op(L,62),bbFill:op(M,9)},
  ict:{ifvg:op(M,28),breaker:op(H,30),mitigation:op(L,26),rejection:op(H,24),bos:H,choch:M,mss:op(H,74),liqSweep:O,kzLon:op(O,9),kzNY:op(H,7),kzAsia:op(L,7),kzSyd:op(M,7),ote:op(M,24),po3Bull:op(L,28),po3Bear:op(H,28),silverBullet:op(O,14),pdh:H,pdl:L},
  kl:{dOpen:O,wOpen:O,mOpen:O,yOpen:O,rthOpen:O,pdc:op(O,62),
      pdh:H,pwh:H,pmh:H,monHigh:op(H,74),rthHigh:op(H,74),prevRthH:op(H,58),onHigh:op(H,58),
      pdl:L,pwl:L,pml:L,monLow:op(L,74),rthLow:op(L,74),prevRthL:op(L,58),onLow:op(L,58),
      monMid:M,rthMid:M,onMid:op(M,74),wkMid:op(M,74),moMid:op(M,58),
      rthFill:op(O,6),onFill:op(M,6),lonFill:op(H,5),nyFill:op(L,5),
      srDayH:op(H,30),srDayL:op(L,30),srWkH:op(H,22),srWkL:op(L,22),srMoH:op(H,15),srMoL:op(L,15),
      dNPOC:op(O,85),wNPOC:op(O,65),mNPOC:op(O,45)},
};}

// ─── PERF: Pure CSS cube — zero JS per frame ─────────────────────────────────
function Cube({th,glow,size=100}){
  const h=size/2;
  const faces=[
    {bg:th.up, t:`translateZ(${h}px)`,           br:1.0},
    {bg:th.dn, t:`rotateY(180deg) translateZ(${h}px)`, br:0.55},
    {bg:th.ac, t:`rotateY(90deg) translateZ(${h}px)`,  br:0.8},
    {bg:th.wk, t:`rotateY(-90deg) translateZ(${h}px)`, br:0.65},
    {bg:th.sf, t:`rotateX(90deg) translateZ(${h}px)`,  br:0.85},
    {bg:th.bg, t:`rotateX(-90deg) translateZ(${h}px)`, br:0.4},
  ];
  return(
    <div style={{width:size,height:size,perspective:700,perspectiveOrigin:"50% 60%",margin:"0 auto"}}>
      <div className="cube-inner" style={{width:size,height:size,position:"relative"}}>
        {faces.map((f,i)=>(
          <div key={i} style={{position:"absolute",width:size,height:size,background:f.bg,transform:f.t,border:"1px solid rgba(255,255,255,0.1)",backfaceVisibility:"hidden",opacity:f.br,boxShadow:glow?`inset 0 0 20px ${f.bg}40`:""}}/>
        ))}
      </div>
    </div>
  );
}

// ─── PERF: Canvas stars — requestAnimationFrame outside React ─────────────────
function Stars(){
  useEffect(()=>{
    const canvas=document.createElement('canvas');
    canvas.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    document.body.appendChild(canvas);
    const resize=()=>{canvas.width=innerWidth;canvas.height=innerHeight;};
    resize();window.addEventListener('resize',resize);
    const ctx=canvas.getContext('2d');
    const S=Array.from({length:140},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.1+0.2,t:Math.random()*Math.PI*2,s:Math.random()*0.008+0.003}));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      S.forEach(s=>{s.t+=s.s;const o=0.15+Math.sin(s.t)*0.15;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${o})`;ctx.fill();});
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);canvas.remove();window.removeEventListener('resize',resize);};
  },[]);
  return null;
}

// ─── MOCK CHART PREVIEW ───────────────────────────────────────────────────────
function MockChart({th,fam}){
  const candles=[
    {o:0.4,h:0.8,l:0.2,c:0.7,bull:true},{o:0.7,h:0.9,l:0.5,c:0.6,bull:false},
    {o:0.6,h:0.75,l:0.35,c:0.65,bull:true},{o:0.65,h:0.85,l:0.55,c:0.8,bull:true},
    {o:0.8,h:0.95,l:0.6,c:0.55,bull:false},{o:0.55,h:0.7,l:0.3,c:0.45,bull:false},
    {o:0.45,h:0.65,l:0.25,c:0.6,bull:true},{o:0.6,h:0.78,l:0.48,c:0.72,bull:true},
  ];
  const W=280,H=120,pad=10;
  const cw=W/candles.length;
  return(
    <div style={{borderRadius:10,overflow:"hidden",background:th.bg,border:"1px solid rgba(255,255,255,0.06)"}}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
        {/* Grid */}
        {[0.25,0.5,0.75].map(y=>(
          <line key={y} x1={0} y1={H*y} x2={W} y2={H*y} stroke={th.gr} strokeWidth="0.5" strokeOpacity="0.4"/>
        ))}
        {/* PDH line */}
        <line x1={0} y1={H*0.15} x2={W} y2={H*0.15} stroke={fam.highs} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.7"/>
        <text x={W-2} y={H*0.15-2} fill={fam.highs} fontSize="5" textAnchor="end" opacity="0.8">PDH</text>
        {/* PDL line */}
        <line x1={0} y1={H*0.82} x2={W} y2={H*0.82} stroke={fam.lows} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.7"/>
        <text x={W-2} y={H*0.82-2} fill={fam.lows} fontSize="5" textAnchor="end" opacity="0.8">PDL</text>
        {/* Daily open */}
        <line x1={0} y1={H*0.48} x2={W} y2={H*0.48} stroke={fam.opens} strokeWidth="1" strokeOpacity="0.8"/>
        <text x={W-2} y={H*0.48-2} fill={fam.opens} fontSize="5" textAnchor="end" opacity="0.9">dOpen</text>
        {/* Candles */}
        {candles.map((c,i)=>{
          const x=i*cw+cw*0.1; const bw=cw*0.8;
          const cy=(v)=>pad+(H-pad*2)*(1-v);
          const fill=c.bull?th.up:th.dn;
          const top=Math.min(c.o,c.c); const bot=Math.max(c.o,c.c);
          return(<g key={i}>
            <line x1={x+bw/2} y1={cy(c.h)} x2={x+bw/2} y2={cy(c.l)} stroke={th.wk} strokeWidth="1"/>
            <rect x={x} y={cy(bot)} width={bw} height={Math.max(1,cy(top)-cy(bot))} fill={fill} rx="1"/>
          </g>);
        })}
      </svg>
      <div style={{padding:"6px 10px",fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#333",letterSpacing:"0.1em"}}>PREVIEW · {th.name.toUpperCase()}</div>
    </div>
  );
}

// ─── CARD GENERATOR ──────────────────────────────────────────────────────────
function CardGenerator({th,fam,glow,onClose}){
  const canvasRef=useRef(null);
  const[done,setDone]=useState(false);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext('2d');
    const W=1200,H=630;
    canvas.width=W;canvas.height=H;
    // Background
    const bg=ctx.createLinearGradient(0,0,W,H);
    bg.addColorStop(0,th.bg);bg.addColorStop(1,th.sf||th.bg);
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    // Subtle grid
    ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
    for(let x=0;x<W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // Left panel
    ctx.fillStyle='rgba(0,0,0,0.25)';
    roundRect(ctx,40,40,360,550,20);ctx.fill();
    // Kit name
    ctx.fillStyle=th.ac;ctx.font='bold 18px monospace';
    ctx.fillText(th.name.toUpperCase(),70,95);
    // Big title
    ctx.fillStyle=th.tx==='#141414'||th.tx==='#101010'?'#f0f0f0':th.tx;
    ctx.font='bold 72px serif';
    ctx.fillText('Chart',70,185);ctx.fillText('Colors',70,265);
    // Tag
    ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='14px monospace';
    ctx.fillText(th.tag.toUpperCase(),70,305);
    // Color bars
    const colors=[
      {hex:fam.opens,label:'OPENS'},{hex:fam.highs,label:'HIGHS'},
      {hex:fam.lows,label:'LOWS'},{hex:fam.mids,label:'MIDS'},
      {hex:th.up,label:'UP CANDLE'},{hex:th.dn,label:'DN CANDLE'},
    ];
    colors.forEach((c,i)=>{
      const y=340+i*38;
      ctx.fillStyle=c.hex;
      roundRect(ctx,70,y,180,28,6);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='11px monospace';
      ctx.fillText(c.label,262,y+18);
    });
    // Right panel — candles
    const cx=500,cy=160,cW=80,cH=180;
    [[th.up,0],[th.dn,cW+30]].forEach(([fill,ox])=>{
      const x=cx+ox;
      ctx.strokeStyle=th.wk;ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(x+cW/2,cy-40);ctx.lineTo(x+cW/2,cy);ctx.stroke();
      ctx.fillStyle=fill;
      roundRect(ctx,x,cy,cW,cH,8);ctx.fill();
      ctx.strokeStyle=th.wk;ctx.lineWidth=2;
      roundRect(ctx,x,cy,cW,cH,8);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x+cW/2,cy+cH);ctx.lineTo(x+cW/2,cy+cH+40);ctx.stroke();
    });
    // Swatch grid
    const sw=[th.bg,th.sf,th.tx,th.ac,th.wk,th.gr];
    sw.forEach((hex,i)=>{
      const sx=500+(i%3)*130,sy=420+Math.floor(i/3)*80;
      ctx.fillStyle=hex;
      roundRect(ctx,sx,sy,110,60,10);ctx.fill();
    });
    // Watermark
    ctx.fillStyle='rgba(255,255,255,0.15)';ctx.font='bold 20px monospace';
    ctx.fillText('trading-color-kit.vercel.app',40,H-24);
    ctx.fillStyle='rgba(255,255,255,0.1)';ctx.font='16px monospace';
    ctx.fillText('by aSian · @_a_Sian_',W-240,H-24);
    setDone(true);
  },[]);
  function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();}
  const download=()=>{
    const a=document.createElement('a');
    a.href=canvasRef.current.toDataURL('image/png');
    a.download=`${th.name.toLowerCase()}-trading-kit.png`;a.click();
  };
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{background:"#0e0e14",borderRadius:20,padding:24,border:"1px solid rgba(255,255,255,0.1)",maxWidth:700,width:"100%",animation:"fadeUp 0.3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontSize:13,fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#888",letterSpacing:"0.1em"}}>CARD GENERATOR · {th.name.toUpperCase()}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#444",fontSize:20,cursor:"pointer",padding:"0 4px"}}>✕</button>
        </div>
        <canvas ref={canvasRef} style={{width:"100%",borderRadius:12,border:"1px solid rgba(255,255,255,0.06)"}}/>
        <div style={{display:"flex",gap:10,marginTop:16}}>
          <button onClick={download} style={{flex:1,padding:"13px",borderRadius:12,background:th.ac,color:"#000",border:"none",fontSize:13,fontFamily:"'Syne',sans-serif",fontWeight:700,cursor:"pointer",letterSpacing:"0.05em"}}>
            ↓ Download PNG (Twitter/Telegram ready)
          </button>
          <button onClick={onClose} style={{padding:"13px 20px",borderRadius:12,background:"rgba(255,255,255,0.05)",color:"#555",border:"1px solid rgba(255,255,255,0.08)",fontSize:13,fontFamily:"'Syne',sans-serif",cursor:"pointer"}}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function ChartSwatch({hex,label,glow}){
  const[cp,sc]=useState(false);
  const b=hex.slice(0,7);
  return(
    <div onClick={()=>{navigator.clipboard?.writeText(b);sc(true);setTimeout(()=>sc(false),1400);}}
      style={{display:"flex",flexDirection:"column",gap:6,alignItems:"center",cursor:"pointer",borderRadius:12,padding:"4px",transition:"background 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <div style={{width:"100%",height:36,borderRadius:10,background:hex,
        boxShadow:glow?`0 0 14px ${hex}50`:"0 2px 8px rgba(0,0,0,0.3)",
        border:`2px solid ${cp?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.08)"}`,
        transition:"border 0.15s",position:"relative",overflow:"hidden"}}>
        {cp&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.5)",fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#90e890",fontWeight:700}}>✓</div>}
      </div>
      <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:cp?"#90e890":"#333",textAlign:"center",transition:"color 0.2s"}}>
        {cp?b.toUpperCase():label.split(" ").slice(0,2).join(" ")}
      </span>
    </div>
  );
}

function ColorRow({hex,label,sub,isLine=true}){
  const[cp,sc]=useState(false);
  const b=hex.slice(0,7);
  return(
    <div onClick={()=>{navigator.clipboard?.writeText(b);sc(true);setTimeout(()=>sc(false),1400);}}
      onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.paddingLeft="20px";}}
      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.paddingLeft="16px";}}
      style={{display:"flex",alignItems:"center",gap:16,padding:"12px 16px",borderRadius:10,cursor:"pointer",transition:"all 0.15s",marginBottom:3}}>
      <div style={{width:44,height:isLine?6:24,borderRadius:isLine?3:8,background:hex,flexShrink:0,boxShadow:`0 2px 14px ${hex}55`}}/>
      <div style={{flex:1}}>
        <div style={{fontSize:14,color:"#c8c0b8",fontWeight:500,fontFamily:"'Syne',sans-serif"}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:"#444",marginTop:2,fontFamily:"'JetBrains Mono',monospace"}}>{sub}</div>}
      </div>
      <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:cp?"#90e890":"#383838",transition:"color 0.2s",letterSpacing:"0.08em",flexShrink:0}}>{cp?"✓ COPIED":b.toUpperCase()}</div>
    </div>
  );
}

function SH({color,label}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"22px 0 6px",paddingTop:18,borderTop:"1px solid rgba(255,255,255,0.05)"}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:color,boxShadow:`0 0 12px ${color}`,flexShrink:0}}/>
      <span style={{fontSize:10,letterSpacing:"0.28em",fontFamily:"'JetBrains Mono',monospace",color,fontWeight:700}}>{label}</span>
      <div style={{flex:1,height:1,background:color,opacity:0.1}}/>
    </div>
  );
}

// ─── RENDER FUNCTIONS ─────────────────────────────────────────────────────────
function renderKL(T,F){const{opens:O,highs:H,lows:L,mids:M}=F;const k=T.kl;return(<div>
  <SH color={O} label="OPENS — NEUTRAL REFERENCE"/>
  {[[k.dOpen,"Daily Open","dOpen"],[k.wOpen,"Weekly Open","wOpen"],[k.mOpen,"Monthly Open","mOpen"],[k.yOpen,"Yearly Open","yOpen"],[k.rthOpen,"RTH Open","Regular Trading Hours"],[k.pdc,"Prev Day Close","PDC"]].map(([h,l,s])=><ColorRow key={l} hex={h} label={l} sub={s}/>)}
  <SH color={H} label="PREVIOUS HIGHS"/>
  {[[k.pdh,"Prev Day High","PDH"],[k.pwh,"Prev Week High","PWH"],[k.pmh,"Prev Month High","PMH"],[k.monHigh,"Monday High",""],[k.rthHigh,"RTH High",""],[k.prevRthH,"Prev RTH High",""],[k.onHigh,"Overnight High","ONH"]].map(([h,l,s])=><ColorRow key={l} hex={h} label={l} sub={s}/>)}
  <SH color={L} label="PREVIOUS LOWS"/>
  {[[k.pdl,"Prev Day Low","PDL"],[k.pwl,"Prev Week Low","PWL"],[k.pml,"Prev Month Low","PML"],[k.monLow,"Monday Low",""],[k.rthLow,"RTH Low",""],[k.prevRthL,"Prev RTH Low",""],[k.onLow,"Overnight Low","ONL"]].map(([h,l,s])=><ColorRow key={l} hex={h} label={l} sub={s}/>)}
  <SH color={op(H,50)} label="S/R LEVELS — DAILY / WEEKLY / MONTHLY"/>
  <ColorRow hex={k.srDayH} label="Daily Resistance" sub="D S/R High" isLine={false}/><ColorRow hex={k.srDayL} label="Daily Support" sub="D S/R Low" isLine={false}/>
  <ColorRow hex={k.srWkH} label="Weekly Resistance" sub="W S/R High" isLine={false}/><ColorRow hex={k.srWkL} label="Weekly Support" sub="W S/R Low" isLine={false}/>
  <ColorRow hex={k.srMoH} label="Monthly Resistance" sub="M S/R High" isLine={false}/><ColorRow hex={k.srMoL} label="Monthly Support" sub="M S/R Low" isLine={false}/>
  <SH color={O} label="nPOC — NAKED POINT OF CONTROL"/>
  <ColorRow hex={k.dNPOC} label="Daily nPOC" sub="Untested prev day POC — strong magnet"/>
  <ColorRow hex={k.wNPOC} label="Weekly nPOC" sub="Untested prev week POC"/>
  <ColorRow hex={k.mNPOC} label="Monthly nPOC" sub="Untested prev month POC"/>
  <SH color={M} label="MIDPOINTS"/>
  {[[k.monMid,"Monday Mid"],[k.rthMid,"RTH Midpoint"],[k.onMid,"Overnight Mid"],[k.wkMid,"Weekly Mid"],[k.moMid,"Monthly Mid"]].map(([h,l])=><ColorRow key={l} hex={h} label={l}/>)}
  <SH color={O} label="SESSION FILLS"/>
  {[[k.rthFill,"RTH Background","RTH",false],[k.onFill,"Overnight / Globex","Globex",false],[k.lonFill,"London Killzone","02:00–05:00 EST",false],[k.nyFill,"New York Killzone","07:00–10:00 EST",false]].map(([h,l,s,ln=false])=><ColorRow key={l} hex={h} label={l} sub={s} isLine={ln}/>)}
</div>);}

function renderICT(T,F){const{opens:O,highs:H,lows:L,mids:M}=F;const ic=T.ict;return(<div>
  <SH color={M} label="STRUCTURE"/>
  {[[ic.bos,"BOS — Break of Structure"],[ic.choch,"ChoCH — Change of Character"],[ic.mss,"MSS — Market Structure Shift"],[ic.liqSweep,"Liquidity Sweep / BSL-SSL"]].map(([h,l])=><ColorRow key={l} hex={h} label={l}/>)}
  <SH color={H} label="BEARISH BLOCKS"/>
  {[[ic.breaker,"Breaker Block","Fill",false],[ic.rejection,"Rejection Block","Fill",false],[ic.po3Bear,"PO3 Bearish","Fill",false],[ic.pdh,"Prev Day High","PDH"]].map(([h,l,s,ln=true])=><ColorRow key={l} hex={h} label={l} sub={s} isLine={ln}/>)}
  <SH color={L} label="BULLISH BLOCKS"/>
  {[[ic.mitigation,"Mitigation Block","Fill",false],[ic.po3Bull,"PO3 Bullish","Fill",false],[ic.pdl,"Prev Day Low","PDL"]].map(([h,l,s,ln=true])=><ColorRow key={l} hex={h} label={l} sub={s} isLine={ln}/>)}
  <SH color={M} label="ENTRY MODELS"/>
  {[[ic.ifvg,"IFVG — Inverse FVG","Fill"],[ic.ote,"OTE — Optimal Trade Entry","0.62–0.79 zone"],[ic.silverBullet,"Silver Bullet","10:00–11:00 EST"]].map(([h,l,s])=><ColorRow key={l} hex={h} label={l} sub={s} isLine={false}/>)}
  <SH color={O} label="KILLZONES"/>
  {[[ic.kzLon,"London Killzone","02:00–05:00 EST"],[ic.kzNY,"New York Killzone","07:00–10:00 EST"],[ic.kzAsia,"Asian Killzone","20:00–00:00 EST"],[ic.kzSyd,"Sydney Killzone","17:00–19:00 EST"]].map(([h,l,s])=><ColorRow key={l} hex={h} label={l} sub={s} isLine={false}/>)}
</div>);}

function renderFib(T){const notes=["Support","","","Equilibrium","Golden Ratio","","","Resistance","Extension"];
  return(<div style={{paddingTop:8}}>{T.fib.map((f,i)=><ColorRow key={f.level} hex={f.hex} label={`${f.level}${notes[i]?" — "+notes[i]:""}`}/>)}</div>);}

function renderVWAP(T,F){const{opens:O,highs:H,lows:L}=F;const v=T.vwap;return(<div>
  <SH color={O} label="VWAP LINE"/>
  <ColorRow hex={v.vwap} label="VWAP Line"/><ColorRow hex={v.anchor} label="aVWAP Anchor"/>
  <SH color={H} label="UPPER BANDS"/>
  {["+1σ","+2σ","+3σ"].map((l,i)=><ColorRow key={l} hex={[v.band1pos,v.band2pos,v.band3pos][i]} label={l+" Band"}/>)}
  <SH color={L} label="LOWER BANDS"/>
  {["−1σ","−2σ","−3σ"].map((l,i)=><ColorRow key={l} hex={[v.band1neg,v.band2neg,v.band3neg][i]} label={l+" Band"}/>)}
</div>);}

function renderZones(T,F){const{highs:H,lows:L,mids:M}=F;const z=T.zones;return(<div>
  <SH color={H} label="BEARISH ZONES"/>
  {[[z.resistance,"Resistance Zone"],[z.bear,"Bearish Box"],[z.premium,"Premium Array"]].map(([h,l])=><ColorRow key={l} hex={h} label={l} isLine={false}/>)}
  <SH color={L} label="BULLISH ZONES"/>
  {[[z.support,"Support Zone"],[z.bull,"Bullish Box"],[z.discount,"Discount Array"]].map(([h,l])=><ColorRow key={l} hex={h} label={l} isLine={false}/>)}
  <SH color={M} label="NEUTRAL ZONES"/>
  {[[z.fvg,"FVG — Fair Value Gap"],[z.orderBlock,"Order Block"],[z.equilibrium,"Equilibrium Zone"]].map(([h,l])=><ColorRow key={l} hex={h} label={l} isLine={false}/>)}
</div>);}

function renderMore(T,ac){const p=T.pivots;const v=T.volProfile;const m=T.mas;const i=T.indicators;return(<div>
  <SH color={ac} label="PIVOTS"/>
  {[["R3",p.r3],["R2",p.r2],["R1",p.r1],["PP — Pivot Point",p.pp],["S1",p.s1],["S2",p.s2],["S3",p.s3]].map(([l,h])=><ColorRow key={l} hex={h} label={l}/>)}
  <SH color={ac} label="MOVING AVERAGES"/>
  {[["9 EMA",m.ma1],["21 EMA",m.ma2],["50 SMA",m.ma3],["100 SMA",m.ma4],["200 SMA",m.ma5]].map(([l,h])=><ColorRow key={l} hex={h} label={l}/>)}
  <SH color={ac} label="VOLUME PROFILE"/>
  <ColorRow hex={v.poc} label="Point of Control"/><ColorRow hex={v.vah} label="Value Area High"/><ColorRow hex={v.val} label="Value Area Low"/><ColorRow hex={v.valueArea} label="Value Area Fill" isLine={false}/>
  <SH color={ac} label="INDICATORS"/>
  <ColorRow hex={i.rsi} label="RSI"/><ColorRow hex={i.macd} label="MACD"/><ColorRow hex={i.macdSig} label="MACD Signal"/>
  <ColorRow hex={i.histBull} label="Histogram Bull" isLine={false}/><ColorRow hex={i.histBear} label="Histogram Bear" isLine={false}/>
  <ColorRow hex={i.bbUp} label="Bollinger Upper"/><ColorRow hex={i.bbDn} label="Bollinger Lower"/>
</div>);}

const SECS=[
  {key:"kl",label:"Key Levels",render:(T,F,ac)=>renderKL(T,F)},
  {key:"ict",label:"ICT / SMC",render:(T,F,ac)=>renderICT(T,F)},
  {key:"fib",label:"Fibonacci",render:(T,F,ac)=>renderFib(T)},
  {key:"vwap",label:"VWAP",render:(T,F,ac)=>renderVWAP(T,F)},
  {key:"zones",label:"Zones",render:(T,F,ac)=>renderZones(T,F)},
  {key:"other",label:"More Tools",render:(T,F,ac)=>renderMore(T,ac)},
];

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({msg}){
  return msg?(<div style={{position:"fixed",bottom:32,left:"50%",transform:"translateX(-50%)",zIndex:500,padding:"12px 24px",borderRadius:24,background:"rgba(20,20,28,0.95)",border:"1px solid rgba(255,255,255,0.1)",color:"#90e890",fontSize:13,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.1em",animation:"toastIn 0.3s ease",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>{msg}</div>):null;
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const[activeTheme,setTheme]=useState(()=>new URLSearchParams(location.search).get('kit')||"ember");
  const[palette,setPal]=useState(()=>new URLSearchParams(location.search).get('pal')||"match");
  const[activeTab,setTab]=useState("kl");
  const[filter,setFilter]=useState("ALL");
  const[search,setSearch]=useState("");
  const[favs,setFavs]=useState(()=>{try{return JSON.parse(localStorage.getItem('tck-favs')||'[]')}catch{return[]}});
  const[showCard,setShowCard]=useState(false);
  const[showChart,setShowChart]=useState(false);
  const[toast,setToast]=useState("");
  const[showFavs,setShowFavs]=useState(false);

  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(""),2200);};

  // Sync URL for shareability
  useEffect(()=>{
    const url=new URL(location.href);
    url.searchParams.set('kit',activeTheme);
    url.searchParams.set('pal',palette);
    history.replaceState(null,'',url);
  },[activeTheme,palette]);

  const toggleFav=(id)=>{
    const next=favs.includes(id)?favs.filter(f=>f!==id):[...favs,id];
    setFavs(next);
    try{localStorage.setItem('tck-favs',JSON.stringify(next));}catch{}
    showToast(next.includes(id)?'❤️ Added to favorites':'Removed from favorites');
  };

  const shareKit=()=>{
    navigator.clipboard?.writeText(location.href);
    showToast('🔗 Link copied — share it!');
  };

  const copyAll=()=>{
    const lines=[`=== ${th.name} · ${palette.toUpperCase()} ===`,`Opens: ${fam.opens}`,`Highs: ${fam.highs}`,`Lows: ${fam.lows}`,`Mids: ${fam.mids}`,`Up Candle: ${th.up}`,`Down Candle: ${th.dn}`,`Background: ${th.bg}`,`Text: ${th.tx}`,`Accent: ${th.ac}`];
    navigator.clipboard?.writeText(lines.join('\n'));
    showToast('📋 All colors copied!');
  };

  const randomKit=()=>{
    const r=THEMES[Math.floor(Math.random()*THEMES.length)];
    setTheme(r.id);setFilter("ALL");
    showToast(`🎲 ${r.name} — ${r.tag}`);
  };

  const cats=[{id:"ALL",label:"✦ ALL",dot:"#e8b84b"},{id:"FAVS",label:"❤️ FAVS",dot:"#e84070"},...Object.entries(CAT_META).map(([id,m])=>({id,label:m.label,dot:m.dot}))];

  let displayed=THEMES;
  if(showFavs||filter==="FAVS") displayed=THEMES.filter(t=>favs.includes(t.id));
  else if(filter!=="ALL") displayed=THEMES.filter(t=>t.cat===filter);
  if(search) displayed=displayed.filter(t=>t.name.toLowerCase().includes(search.toLowerCase())||t.tag.toLowerCase().includes(search.toLowerCase())||t.cat.toLowerCase().includes(search.toLowerCase()));

  const th=displayed.find(t=>t.id===activeTheme)||THEMES.find(t=>t.id===activeTheme)||THEMES[0];
  const fam=th[palette];
  const T=tools(fam.opens,fam.highs,fam.lows,fam.mids,th.ac);
  const sec=SECS.find(s=>s.key===activeTab);
  const cm=CAT_META[th.cat]||{label:"",dot:"#888"};
  const glow=["NEON","VIBE","DEGEN","CYBER","FREAK","AURA","GUM","FREE","ANIME","MEME"].includes(th.cat);
  const cardBg=SBGS[th.id]||PHANTOM_SBGS[th.id]||th.bg;
  const isFav=favs.includes(th.id);

  // Trending kits
  const TRENDING=["bitcoin","sol","pepe","matrix","fire","eth","synthwave","neonnoir","uranium","shohen"];

  const glassStyle={background:"rgba(255,255,255,0.03)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.07)"};

  return(
    <div style={{minHeight:"100vh",background:"#05050f",position:"relative"}}>
      <Stars/>
      {/* Ambient glow */}
      <div style={{position:"fixed",top:"15%",left:"50%",transform:"translateX(-50%)",width:700,height:500,borderRadius:"50%",background:`radial-gradient(circle, ${th.ac}06 0%, transparent 70%)`,pointerEvents:"none",transition:"background 1.2s ease",zIndex:0}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)",backgroundSize:"80px 80px",pointerEvents:"none",zIndex:0}}/>

      <div style={{position:"relative",zIndex:1}}>

        {/* NAV */}
        <nav style={{position:"sticky",top:0,zIndex:100,...glassStyle,borderRadius:0,borderLeft:"none",borderRight:"none",borderTop:"none"}}>
          <div className="nav-inner" style={{padding:"0 52px",display:"flex",alignItems:"center",height:64,gap:16,maxWidth:1500,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:9,background:`linear-gradient(135deg,${th.ac},${th.ac}66)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:`0 0 24px ${th.ac}50`,transition:"all 0.4s",flexShrink:0}}>◈</div>
              <div className="hide-mobile">
                <div style={{fontSize:15,fontWeight:800,letterSpacing:"-0.02em",fontFamily:"'Syne',sans-serif",lineHeight:1}}>Trading Color Kits</div>
                <div style={{fontSize:9,color:"#282828",letterSpacing:"0.22em",fontFamily:"'JetBrains Mono',monospace",marginTop:1}}>BY aSian · 90 KITS</div>
              </div>
            </div>
            {/* Search */}
            <div style={{flex:1,maxWidth:280,position:"relative"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search kits..." style={{width:"100%",padding:"8px 14px 8px 36px",borderRadius:20,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"#888",fontSize:12,fontFamily:"'JetBrains Mono',monospace",outline:"none",letterSpacing:"0.04em"}}/>
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#333",fontSize:12}}>⌕</span>
            </div>
            <div style={{flex:1}}/>
            {/* Actions */}
            <button onClick={randomKit} title="Random kit" style={{padding:"7px 14px",...glassStyle,borderRadius:20,color:"#555",fontSize:11,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",border:"1px solid rgba(255,255,255,0.07)",letterSpacing:"0.08em"}} className="hide-mobile">🎲 RANDOM</button>
            <div style={{display:"flex",gap:4,padding:3,borderRadius:24,...glassStyle}}>
              {["match","vivid"].map(p=>{const a=palette===p;return(
                <button key={p} onClick={()=>setPal(p)} style={{padding:"6px 16px",borderRadius:20,background:a?th.ac:"transparent",color:a?"#000":"#444",border:"none",fontSize:11,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",transition:"all 0.2s",fontWeight:a?"700":"400",boxShadow:a&&glow?`0 0 18px ${th.ac}70`:"none"}}>
                  {PAL[p].icon} {PAL[p].label}
                </button>
              );})}
            </div>
          </div>
        </nav>

        {/* HERO */}
        <div className="main-pad" style={{padding:"72px 52px 48px",maxWidth:1500,margin:"0 auto"}}>
          <div className="hero-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center",marginBottom:64}}>
            <div className="fade-up">
              <div style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:th.ac,letterSpacing:"0.35em",marginBottom:18,textShadow:glow?`0 0 20px ${th.ac}`:"none"}}>✦ THE DEFINITIVE TRADINGVIEW COLOR REFERENCE</div>
              <h1 className="hero-h1" style={{fontSize:"clamp(48px,5.5vw,88px)",fontWeight:800,lineHeight:0.9,letterSpacing:"-0.04em",fontFamily:"'Syne',sans-serif",marginBottom:22}}>
                Chart<br/>
                <span style={{WebkitTextStroke:`1px ${th.ac}`,WebkitTextFillColor:"transparent",textShadow:glow?`0 0 60px ${th.ac}30`:"none",transition:"all 0.5s"}}>Color</span><br/>
                Kits
              </h1>
              <p style={{fontSize:15,color:"#3a3a3a",maxWidth:460,lineHeight:1.7,fontFamily:"'Syne',sans-serif",marginBottom:32}}>90 curated color systems for TradingView. Key Levels, ICT/SMC, Fibonacci, VWAP, nPOC and more. Click any color to copy.</p>
              {/* Trending */}
              <div style={{marginBottom:24}}>
                <div style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#282828",letterSpacing:"0.25em",marginBottom:10}}>🔥 TRENDING</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {TRENDING.map(id=>{const t=THEMES.find(x=>x.id===id);if(!t)return null;return(
                    <button key={id} onClick={()=>{setTheme(id);setFilter("ALL");}} style={{padding:"5px 12px",borderRadius:16,background:activeTheme===id?t.ac+"22":"rgba(255,255,255,0.04)",border:`1px solid ${t.ac}44`,color:t.ac,fontSize:10,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",transition:"all 0.18s",letterSpacing:"0.06em"}}>
                      {t.name}
                    </button>
                  );})}
                </div>
              </div>
            </div>
            {/* 3D Hero */}
            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}} className="hide-mobile">
              <div style={{position:"relative"}}>
                <div style={{position:"absolute",inset:-80,borderRadius:"50%",background:`radial-gradient(circle,${th.ac}14 0%,transparent 70%)`,filter:"blur(24px)",transition:"background 0.8s"}} className="glow-pulse"/>
                <div className="cube-wrap">
                  <Cube th={th} glow={glow} size={130}/>
                </div>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%) rotateX(72deg)",width:220,height:220,borderRadius:"50%",border:`1px solid ${th.ac}18`,pointerEvents:"none"}}/>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%) rotateX(72deg) rotateZ(60deg)",width:290,height:290,borderRadius:"50%",border:`1px solid ${th.ac}0c`,pointerEvents:"none"}}/>
              </div>
            </div>
          </div>

          {/* CATEGORY FILTER */}
          <div className="noscroll" style={{display:"flex",gap:7,marginBottom:20}}>
            {cats.map(c=>{const a=(filter===c.id|||(c.id==="FAVS"&&showFavs));return(
              <button key={c.id} onClick={()=>{if(c.id==="FAVS"){setShowFavs(true);setFilter("FAVS");}else{setShowFavs(false);setFilter(c.id);}}} style={{flex:"0 0 auto",padding:"8px 18px",borderRadius:22,background:a?c.dot:"rgba(255,255,255,0.03)",color:a?"#000":c.dot,border:`1px solid ${a?c.dot:c.dot+"33"}`,fontSize:10,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",transition:"all 0.18s",fontWeight:a?"700":"400",letterSpacing:"0.1em",whiteSpace:"nowrap",boxShadow:a?`0 0 18px ${c.dot}40`:"none"}}>{c.label}</button>
            );})}
          </div>

          {/* THEME GRID */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:9,marginBottom:64}}>
            {displayed.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"48px 0",color:"#2a2a2a",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>No kits found. <button onClick={()=>{setSearch("");setFilter("ALL");setShowFavs(false);}} style={{color:th.ac,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:"inherit"}}>Clear filters</button></div>}
            {displayed.map(t=>{
              const tcm=CAT_META[t.cat]||{dot:"#888",label:""};
              const active=th.id===t.id;
              const tg=["NEON","VIBE","DEGEN","CYBER","FREAK","AURA","GUM","FREE","ANIME","MEME"].includes(t.cat);
              const bg=SBGS[t.id]||PHANTOM_SBGS[t.id]||t.bg;
              const isTrending=TRENDING.includes(t.id);
              return(
                <button key={t.id} onClick={()=>setTheme(t.id)} className={`kit-card${active?" active":""}`}
                  style={{padding:"16px 14px",borderRadius:14,background:bg,border:`1.5px solid ${active?t.ac+"aa":"rgba(255,255,255,0.05)"}`,cursor:"pointer",textAlign:"left",backdropFilter:"blur(8px)",boxShadow:active?`0 14px 44px ${t.ac}30,0 0 0 1px ${t.ac}25`:"0 2px 8px rgba(0,0,0,0.4)",position:"relative"}}>
                  {isTrending&&<div style={{position:"absolute",top:8,right:8,fontSize:8}}>🔥</div>}
                  {favs.includes(t.id)&&<div style={{position:"absolute",top:8,right:isTrending?22:8,fontSize:8}}>❤️</div>}
                  <div style={{display:"flex",gap:5,marginBottom:10}}>
                    <div style={{width:17,height:17,borderRadius:4,background:t.up,border:"1px solid rgba(255,255,255,0.12)",boxShadow:tg?`0 0 10px ${t.up}80`:"none"}}/>
                    <div style={{width:17,height:17,borderRadius:4,background:t.dn,border:"1px solid rgba(255,255,255,0.08)"}}/>
                  </div>
                  <div style={{fontSize:10,fontFamily:"'Syne',sans-serif",color:active?t.tx:"rgba(255,255,255,0.5)",fontWeight:700,letterSpacing:"0.04em",marginBottom:3}}>{t.name}</div>
                  {tcm.label&&<div style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",color:tcm.dot,letterSpacing:"0.1em",opacity:0.8}}>{tcm.label}</div>}
                </button>
              );
            })}
          </div>

          {/* MAIN DETAIL */}
          <div className="detail-grid" style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:40,alignItems:"start"}}>

            {/* LEFT CARD */}
            <div className="sticky-card" style={{position:"sticky",top:80}}>
              <div key={th.id} style={{borderRadius:24,...glassStyle,overflow:"hidden",animation:"slideIn 0.3s ease",boxShadow:glow?`0 24px 80px rgba(0,0,0,0.6), 0 0 60px ${th.ac}15`:"0 24px 60px rgba(0,0,0,0.5)"}}>
                <div style={{height:2,background:`linear-gradient(90deg,transparent,${th.ac},transparent)`,opacity:glow?1:0.35}}/>
                <div style={{padding:"32px 28px 24px"}}>
                  {/* Header row */}
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                    <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:th.ac,letterSpacing:"0.3em",textShadow:glow?`0 0 18px ${th.ac}`:"none",flex:1}}>{th.name}</span>
                    {cm.label&&<span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",padding:"3px 8px",borderRadius:20,color:cm.dot,border:`1px solid ${cm.dot}44`,background:cm.dot+"14",letterSpacing:"0.12em"}}>{cm.label}</span>}
                    {/* Fav button */}
                    <button onClick={()=>toggleFav(th.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,opacity:isFav?1:0.25,transition:"all 0.2s",padding:"2px"}} title={isFav?"Remove from favorites":"Add to favorites"}>{isFav?"❤️":"🤍"}</button>
                  </div>
                  <div style={{fontSize:48,fontWeight:800,lineHeight:0.92,fontFamily:"'Syne',sans-serif",marginBottom:6,letterSpacing:"-0.03em",color:"#f0f0f0",textShadow:glow?`0 0 40px ${th.ac}30`:"none"}}>Chart<br/>Colors</div>
                  <div style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#282828",letterSpacing:"0.1em",marginBottom:24}}>{th.tag.toUpperCase()}</div>

                  {/* Chart preview toggle */}
                  <button onClick={()=>setShowChart(s=>!s)} style={{width:"100%",padding:"10px",borderRadius:10,...glassStyle,color:"#444",fontSize:11,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",marginBottom:16,letterSpacing:"0.08em",border:"1px solid rgba(255,255,255,0.07)",transition:"all 0.2s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}>
                    {showChart?"▲ HIDE CHART PREVIEW":"▼ SHOW CHART PREVIEW"}
                  </button>
                  {showChart&&<div style={{marginBottom:16}}><MockChart th={th} fam={fam}/></div>}

                  {/* Mini cube */}
                  <div style={{marginBottom:24,display:"flex",justifyContent:"center",padding:"20px",background:"rgba(0,0,0,0.25)",borderRadius:14,border:"1px solid rgba(255,255,255,0.04)"}}>
                    <div className="cube-wrap"><Cube th={th} glow={glow} size={90}/></div>
                  </div>

                  {/* Swatches */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
                    {Object.entries(th.chart).map(([k,s])=><ChartSwatch key={k} hex={s.hex} label={s.label} glow={glow}/>)}
                  </div>

                  {/* Families */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
                    {[["OPENS",fam.opens],["HIGHS",fam.highs],["LOWS",fam.lows],["MIDS",fam.mids]].map(([label,color])=>(
                      <div key={label} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 11px",borderRadius:10,background:`${color}10`,border:`1px solid ${color}22`,cursor:"pointer",transition:"all 0.15s"}}
                        onClick={()=>{navigator.clipboard?.writeText(color.slice(0,7));showToast(`Copied ${label}: ${color.slice(0,7)}`);}}
                        onMouseEnter={e=>e.currentTarget.style.background=`${color}1e`}
                        onMouseLeave={e=>e.currentTarget.style.background=`${color}10`}>
                        <div style={{width:10,height:10,borderRadius:"50%",background:color,boxShadow:`0 0 ${glow?"16px":"8px"} ${color}`,flexShrink:0}}/>
                        <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color,fontWeight:700,letterSpacing:"0.06em"}}>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <button onClick={()=>setShowCard(true)} style={{padding:"10px",borderRadius:10,background:th.ac,color:"#000",border:"none",fontSize:10,fontFamily:"'Syne',sans-serif",fontWeight:700,cursor:"pointer",letterSpacing:"0.06em",transition:"opacity 0.2s"}}
                      onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                      🖼 CARD
                    </button>
                    <button onClick={shareKit} style={{padding:"10px",borderRadius:10,...glassStyle,color:"#555",border:"1px solid rgba(255,255,255,0.08)",fontSize:10,fontFamily:"'Syne',sans-serif",fontWeight:700,cursor:"pointer",letterSpacing:"0.06em"}}>
                      🔗 SHARE
                    </button>
                    <button onClick={copyAll} style={{padding:"10px",borderRadius:10,...glassStyle,color:"#555",border:"1px solid rgba(255,255,255,0.08)",fontSize:10,fontFamily:"'Syne',sans-serif",fontWeight:700,cursor:"pointer",letterSpacing:"0.06em",gridColumn:"1/-1"}}>
                      📋 COPY ALL COLORS
                    </button>
                  </div>
                </div>
                <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"14px 28px",display:"flex",alignItems:"center",gap:8}}>
                  <div className="glow-pulse" style={{width:5,height:5,borderRadius:"50%",background:th.ac,boxShadow:`0 0 8px ${th.ac}`}}/>
                  <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#242424",letterSpacing:"0.1em"}}>{PAL[palette].label} · {PAL[palette].desc.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* RIGHT — TOOLS */}
            <div>
              <div className="noscroll" style={{display:"flex",gap:6,marginBottom:18}}>
                {SECS.map(s=>{const a=activeTab===s.key;return(
                  <button key={s.key} onClick={()=>setTab(s.key)} style={{flex:"0 0 auto",padding:"10px 20px",borderRadius:22,background:a?th.ac:"rgba(255,255,255,0.03)",color:a?"#000":"#404040",border:`1px solid ${a?th.ac:"rgba(255,255,255,0.06)"}`,fontSize:12,fontFamily:"'Syne',sans-serif",cursor:"pointer",transition:"all 0.18s",fontWeight:a?"700":"500",whiteSpace:"nowrap",boxShadow:a&&glow?`0 0 22px ${th.ac}55`:"none"}}>
                    {s.label}
                  </button>
                );})}
              </div>
              <div style={{...glassStyle,borderRadius:20,overflow:"hidden"}}>
                <div style={{padding:"14px 22px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:10}}>
                  <div className="glow-pulse" style={{width:6,height:6,borderRadius:"50%",background:th.ac,boxShadow:`0 0 10px ${th.ac}`}}/>
                  <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#303030",letterSpacing:"0.18em"}}>{SECS.find(s=>s.key===activeTab)?.label.toUpperCase()} · CLICK ROW TO COPY HEX</span>
                </div>
                <div style={{padding:"6px 6px 18px",maxHeight:640,overflowY:"auto"}}>
                  {sec?.render(T,fam,th.ac)}
                </div>
              </div>
              <div style={{marginTop:12,padding:"14px 22px",...glassStyle,borderRadius:14,display:"flex",gap:12,alignItems:"center"}}>
                <span style={{fontSize:16,flexShrink:0}}>💡</span>
                <span style={{fontSize:12,fontFamily:"'Syne',sans-serif",color:"#333",lineHeight:1.5}}>Copy hex → TradingView → right-click any tool → Edit → paste color</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div style={{borderTop:"1px solid rgba(255,255,255,0.04)",marginTop:80,padding:"28px 0",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
            <div style={{width:22,height:22,borderRadius:6,background:`linear-gradient(135deg,${th.ac},${th.ac}55)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>◈</div>
            <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#1e1e1e",letterSpacing:"0.15em"}}>TRADING COLOR KITS · 90 THEMES · 16 CATEGORIES</span>
            <div style={{flex:1}}/>
            <a href="https://x.com/_a_Sian_" target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:20,...glassStyle,textDecoration:"none",transition:"all 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#444"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#383838",letterSpacing:"0.08em"}}>made by</span>
              <span style={{fontSize:11,fontFamily:"'Syne',sans-serif",color:"#555",fontWeight:700}}>aSian</span>
            </a>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showCard&&<CardGenerator th={th} fam={fam} glow={glow} onClose={()=>setShowCard(false)}/>}
      <Toast msg={toast}/>
    </div>
  );
}
