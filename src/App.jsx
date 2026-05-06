import { useState, useEffect, useRef, useCallback } from "react";
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

// ── MINIMAL (5 new) ──────────────────────────────────────────────────────────
Th("chalk","MINIMAL","CHALK","Paper · Warm White · Editorial Silence",
  "#f8f7f4","#ffffff","#1a1916","#888880","#e0dcd8","#2c2820","#888880","#eeedea",
  P("#806818","#904030","#186838","#403868"),P("#b89020","#c03020","#20a048","#6028b0")),

Th("lead","MINIMAL","LEAD","Pencil · Dark Grey · Sketch",
  "#1c1c1c","#242424","#e0e0e0","#888888","#e0e0e0","#444444","#666666","#282828",
  P("#a09828","#a84040","#388878","#7040a8"),P("#e0d030","#d04040","#30c0a0","#a040e0")),

Th("bone","MINIMAL","BONE","Ivory · Stripped · Quiet Authority",
  "#f0ede8","#f8f5f0","#2c2820","#a89880","#f8f5f0","#2c2820","#a89880","#e4e0d8",
  P("#907018","#983828","#187040","#402870"),P("#c09820","#c02828","#20a850","#6020b0")),

Th("soot","MINIMAL","SOOT","Near Black · Ashy · Absolute Minimal",
  "#0a0a0a","#121212","#d0d0d0","#606060","#c0c0c0","#282828","#404040","#161616",
  P("#a09828","#a04040","#308888","#704898"),P("#e0d030","#d03030","#30c0c0","#9040e0")),

Th("flint","MINIMAL","FLINT","Stone · Cool Grey · Swiss Precision",
  "#e8e4e0","#f0ece8","#282420","#706860","#f0ece8","#282420","#706860","#dedad6",
  P("#806018","#983028","#186840","#382870"),P("#b88820","#c02828","#18a848","#5820b0")),

// ── ART / CREATE (2 new) ──────────────────────────────────────────────────────
Th("studio","CREATE","STUDIO","Ochre · Burnt Sienna · Artist Loft",
  "#f4ece0","#faf4ec","#241808","#c86820","#e8d0a8","#241808","#c86820","#e4dccc",
  P("#a87018","#b83818","#186840","#402870"),P("#d09820","#e02818","#20a850","#6020b0")),

Th("darkroom","CREATE","DARKROOM","Safelight · Photo · Dark Red",
  "#0c0404","#140808","#e8c0a8","#c04020","#e8c0a8","#800010","#c04020","#100606",
  P("#b07818","#a01810","#186038","#501080"),P("#f0a820","#d01010","#20a850","#9010c0")),

// ── AURA (2 new) ──────────────────────────────────────────────────────────────
Th("silveraura","AURA","SILVER AURA","Ethereal · Metallic · Moonlight Field",
  "#0e1018","#141820","#d8e0f0","#a0b0d0","#d8e0f0","#506080","#a0b0d0","#121820",
  P("#a0a828","#6080b0","#4098a8","#6878b8"),P("#e0d838","#4090e0","#40c0c8","#9090f0")),

Th("roseaura","AURA","ROSE AURA","Pink Quartz · Love Energy · Soft Frequency",
  "#180c14","#221020","#f0c8e0","#d068a8","#f0c8e0","#803060","#d068a8","#1c1018",
  P("#c09820","#d06090","#308878","#8040a0"),P("#f0d030","#f05098","#30c898","#c040e0")),

// ── FANTASY / FAE (2 new) ──────────────────────────────────────────────────────
Th("fairy","FANTASY","FAIRY","Ethereal · Magical · Forest Light",
  "#0a1410","#0e1c18","#c0f0d8","#60d898","#c0f0d8","#f080c0","#60d898","#0e1814",
  P("#b0c020","#c06090","#60d898","#6040a8"),P("#e0f020","#f06098","#60f8b8","#9040f0")),

Th("voidrift","FANTASY","VOID RIFT","Cosmic · Dark Matter · Rift Energy",
  "#060810","#0c1018","#80c0e0","#2080b0","#80c0e0","#a040c0","#2080b0","#080c14",
  P("#a0a030","#3070b0","#2090a0","#6040b0"),P("#e0e030","#3090f0","#30c0d0","#a040f0")),



// ── CLASSIC (5 new) ───────────────────────────────────────────────────────────
Th("burgundy","CLASSIC","BURGUNDY","Deep Wine · Rich · After Hours",
  "#120408","#1c0810","#e8c0c8","#c83058","#e8c0c8","#80102c","#c83058","#180610",
  P("#c89820","#c03050","#20a060","#702870"),P("#f0c030","#f03060","#30d880","#a030b0")),

Th("terra","CLASSIC","TERRA","Clay · Rust · Earth Deep",
  "#100806","#181008","#e0c0a0","#c06030","#e0c0a0","#803818","#c06030","#140a06",
  P("#b88020","#c04020","#208858","#603070"),P("#e8a828","#e84820","#28c870","#9030b0")),

Th("arctic","CLASSIC","ARCTIC","Ice · Polar · Clean Distance",
  "#080c14","#0c1020","#c8d8f0","#4880c0","#c8d8f0","#305898","#4880c0","#0a1018",
  P("#a0a828","#4070b8","#38a890","#5040a8"),P("#d8e030","#3090f0","#38d8b8","#7848e0")),

Th("onyx","CLASSIC","ONYX","Jet Black · Polished · Zero Noise",
  "#040404","#080808","#d8d8d8","#808080","#d8d8d8","#383838","#606060","#060606",
  P("#a89820","#a04040","#308878","#604898"),P("#e8d030","#e04040","#30c0b0","#9040e0")),

Th("dawnrise","CLASSIC","DAWN RISE","Sunrise · Warm Horizon · Morning Open",
  "#0c0804","#180e08","#f0d8b8","#e09040","#f0d8b8","#803010","#e09040","#140c06",
  P("#c09820","#c05020","#38a060","#6830a0"),P("#f0c030","#f06020","#48d870","#9830e0")),

// ── DEGEN (3 new) ─────────────────────────────────────────────────────────────
Th("casino","DEGEN","CASINO","Felt Green · Vegas · High Roller",
  "#020c04","#041408","#20f060","#10c840","#20f060","#c83020","#10c840","#040e06",
  P("#e0c020","#c82020","#10c840","#8020c0"),P("#f8e030","#f02020","#10f860","#b820f0")),

Th("radioactive","DEGEN","RADIOACTIVE","Toxic · Overflow · Meltdown",
  "#060800","#0a0e00","#c8f810","#a0d000","#c8f810","#f83020","#a0d000","#080a02",
  P("#d0e020","#f03020","#a0d000","#8020c0"),P("#f8f820","#f83020","#c8f010","#c020f0")),

Th("hacker","DEGEN","HACKER","Terminal Green · Code · Matrix Rain",
  "#000800","#001000","#00ff41","#00cc34","#00ff41","#ff2200","#00cc34","#000a00",
  P("#ccdd00","#ff2200","#00dd44","#7700cc"),P("#eeff00","#ff4400","#00ff55","#aa00ff")),

// ── PRO (2 new) ───────────────────────────────────────────────────────────────
Th("institutional","PRO","INSTITUTIONAL","Bloomberg · Desk · Serious Capital",
  "#080a10","#0c1018","#c0c8d8","#4060a0","#c0c8d8","#c84020","#4060a0","#0a0c14",
  P("#a09828","#c04030","#2888a0","#484898"),P("#d8c838","#e84030","#28a8c8","#6848c8")),

Th("quant","PRO","QUANT","Grey Scale · Systematic · Data Pure",
  "#080808","#101010","#d8d8d8","#888888","#e8e8e8","#c84040","#606060","#0c0c0c",
  P("#b8a828","#b84040","#30a088","#585898"),P("#e8d830","#e84040","#38c8a8","#7878c8")),

// ── ANIME (2 new) ─────────────────────────────────────────────────────────────
Th("dragonball","ANIME","DRAGON BALL","Ki · Power Level Over 9000 · Orange Aura",
  "#100800","#200e00","#f8c040","#f07000","#f8c040","#e03010","#f07000","#180c00",
  P("#f0a020","#e03010","#20b848","#8020c0"),P("#f8c030","#f83010","#28e858","#b020f0")),

Th("hunterx","ANIME","HUNTER X","Nen · Aura Control · Transcendent",
  "#0a0808","#140e0c","#f0e0d0","#d09060","#f0e0d0","#8030c0","#d09060","#0e0a08",
  P("#c8a020","#c83060","#208870","#6030a8"),P("#f8c830","#f83070","#28c890","#9040e8")),

// ── GUM (2 new) ───────────────────────────────────────────────────────────────
Th("bubblegum2","GUM","DOUBLE BUBBLE","Extra Sweet · Sticky · Pink Overdose",
  "#180810","#281018","#f880c8","#e040a0","#f880c8","#40d8f0","#e040a0","#200c16",
  P("#e0a020","#e040a0","#40c8a0","#8030c0"),P("#f8c030","#f840b0","#40f0c0","#b830f0")),

Th("watermelon","GUM","WATERMELON","Summer · Refreshing · Slice",
  "#040c04","#081408","#f06070","#e03050","#f06070","#40c040","#e03050","#060e06",
  P("#d0c020","#e03050","#40c040","#6830a0"),P("#f8e020","#f83060","#48f048","#9030e0")),

// ── FREE (2 new) ──────────────────────────────────────────────────────────────
Th("polarnight","FREE","POLAR NIGHT","Aurora · Northern · Deep Cold",
  "#04060e","#080c18","#80c8f0","#3090c8","#80c8f0","#c84080","#3090c8","#060810",
  P("#a0a830","#3090c8","#30a8a0","#5838b0"),P("#d8e038","#30b8f8","#38d0c8","#7840f0")),

Th("sahara","FREE","SAHARA","Desert · Golden Hour · Sand Drift",
  "#0c0800","#181000","#f0d090","#d8a040","#f0d090","#e04820","#d8a040","#140c00",
  P("#d0a020","#d84020","#28a860","#703080"),P("#f8c828","#f85020","#38d878","#a038c0")),



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

// ─── NEW KIT TRACKING ────────────────────────────────────────────────────────
// ─── HIGHLIGHT MATCH ─────────────────────────────────────────────────────────
function Highlight({text,query,color}){
  if(!query||!query.trim())return <span>{text}</span>;
  const q=query.trim();
  const idx=text.toLowerCase().indexOf(q.toLowerCase());
  if(idx<0)return <span>{text}</span>;
  return(<span>
    {text.slice(0,idx)}
    <span style={{background:`${color}40`,color,borderRadius:3,padding:"0 2px"}}>{text.slice(idx,idx+q.length)}</span>
    {text.slice(idx+q.length)}
  </span>);
}

const NEW_KITS_RELEASE = {
  chalk:1777420800000, lead:1777420800000, bone:1777420800000, soot:1777420800000, flint:1777420800000,
  studio:1777420800000, darkroom:1777420800000, silveraura:1777420800000, roseaura:1777420800000,
  fairy:1777420800000, voidrift:1777420800000,
  phantom:1777334400000, oracle:1777334400000, specter:1777334400000,
  doge:1777334400000, wif:1777334400000, bonk:1777334400000,
  neonnoir:1777334400000, chromepunk:1777334400000, purpleaura:1777334400000, goldenaura:1777334400000,
  acid:1777334400000, glitch:1777334400000, mortis:1777334400000, eclipse:1777334400000,
  canvas:1777334400000, spectrum:1777334400000, dragon:1777334400000, elven:1777334400000,
};
const isNew=(id)=>{const r=NEW_KITS_RELEASE[id];if(!r)return false;return Date.now()-r < 5*24*60*60*1000;};


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
  ict:{fvg:op(M,32),ifvg:op(M,22),breaker:op(H,30),mitigation:op(L,26),rejection:op(H,24),bos:H,choch:M,mss:op(H,74),liqSweep:O,kzLon:op(O,9),kzNY:op(H,7),kzAsia:op(L,7),kzSyd:op(M,7),ote:op(M,24),po3Bull:op(L,28),po3Bear:op(H,28),silverBullet:op(O,14),pdh:H,pdl:L},
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
function Stars({accentColor='#ffffff'}){
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
      S.forEach(s=>{s.t+=s.s;const o=0.15+Math.sin(s.t)*0.15;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);const ac2=accentColor&&accentColor.length>=7?accentColor:'#ffffff';
        const ar=parseInt(ac2.slice(1,3),16)||200;
        const ag=parseInt(ac2.slice(3,5),16)||200;
        const ab=parseInt(ac2.slice(5,7),16)||200;
        const tr=Math.round(200+ar*0.22),tg=Math.round(200+ag*0.22),tb=Math.round(200+ab*0.22);
        ctx.fillStyle=`rgba(${Math.min(255,tr)},${Math.min(255,tg)},${Math.min(255,tb)},${o})`;ctx.fill();});
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);canvas.remove();window.removeEventListener('resize',resize);};
  },[accentColor]);
  return null;
}

// ─── MOCK CHART PREVIEW ───────────────────────────────────────────────────────
function MockChart({th,fam,candleStyle='candles',timeframe='H1'}){
  // Different candle profiles per timeframe
  const TF_CANDLES={
    M1:[{o:0.5,h:0.55,l:0.47,c:0.53},{o:0.53,h:0.56,l:0.51,c:0.52},{o:0.52,h:0.54,l:0.49,c:0.50},{o:0.50,h:0.53,l:0.48,c:0.52},{o:0.52,h:0.58,l:0.51,c:0.57},{o:0.57,h:0.60,l:0.54,c:0.55},{o:0.55,h:0.57,l:0.52,c:0.54},{o:0.54,h:0.56,l:0.51,c:0.55},{o:0.55,h:0.59,l:0.53,c:0.58},{o:0.58,h:0.61,l:0.56,c:0.59},{o:0.59,h:0.62,l:0.57,c:0.58},{o:0.58,h:0.60,l:0.55,c:0.57}],
    M5:[{o:0.45,h:0.55,l:0.42,c:0.52},{o:0.52,h:0.58,l:0.49,c:0.50},{o:0.50,h:0.53,l:0.44,c:0.48},{o:0.48,h:0.56,l:0.46,c:0.55},{o:0.55,h:0.62,l:0.52,c:0.60},{o:0.60,h:0.65,l:0.55,c:0.57},{o:0.57,h:0.60,l:0.50,c:0.52},{o:0.52,h:0.56,l:0.48,c:0.55},{o:0.55,h:0.63,l:0.53,c:0.61},{o:0.61,h:0.66,l:0.58,c:0.60}],
    H1:[{o:0.4,h:0.8,l:0.2,c:0.7},{o:0.7,h:0.9,l:0.5,c:0.6},{o:0.6,h:0.75,l:0.35,c:0.65},{o:0.65,h:0.85,l:0.55,c:0.8},{o:0.8,h:0.95,l:0.6,c:0.55},{o:0.55,h:0.7,l:0.3,c:0.45},{o:0.45,h:0.65,l:0.25,c:0.6},{o:0.6,h:0.78,l:0.48,c:0.72}],
    D1:[{o:0.3,h:0.9,l:0.15,c:0.75},{o:0.75,h:0.95,l:0.6,c:0.65},{o:0.65,h:0.80,l:0.3,c:0.45},{o:0.45,h:0.70,l:0.2,c:0.68},{o:0.68,h:0.92,l:0.55,c:0.85},{o:0.85,h:0.98,l:0.7,c:0.72}],
  };
  const candles=(TF_CANDLES[timeframe]||TF_CANDLES.H1).map(cv=>({...cv,bull:cv.c>=cv.o}));
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
        {candles.map((cv,i)=>{
          const x=i*cw+cw*0.1; const bw=cw*0.8;
          const cy=(v)=>pad+(H-pad*2)*(1-v);
          const bull=cv.c>=cv.o;
          const fill=bull?th.up:th.dn;
          const top=Math.min(cv.o,cv.c); const bot=Math.max(cv.o,cv.c);
          const bodyH=Math.max(1,cy(top)-cy(bot));
          if(candleStyle==='bars') return(<g key={i}>
            <line x1={x+bw/2} y1={cy(cv.h)} x2={x+bw/2} y2={cy(cv.l)} stroke={fill} strokeWidth="1.5"/>
            <line x1={x} y1={cy(cv.o)} x2={x+bw/2} y2={cy(cv.o)} stroke={fill} strokeWidth="1.5"/>
            <line x1={x+bw/2} y1={cy(cv.c)} x2={x+bw} y2={cy(cv.c)} stroke={fill} strokeWidth="1.5"/>
          </g>);
          if(candleStyle==='hollow') return(<g key={i}>
            <line x1={x+bw/2} y1={cy(cv.h)} x2={x+bw/2} y2={cy(bot)} stroke={th.wk} strokeWidth="1"/>
            <line x1={x+bw/2} y1={cy(top)} x2={x+bw/2} y2={cy(cv.l)} stroke={th.wk} strokeWidth="1"/>
            <rect x={x} y={cy(bot)} width={bw} height={bodyH} fill={bull?"transparent":fill} stroke={fill} strokeWidth="1.5" rx="1"/>
          </g>);
          return(<g key={i}>
            <line x1={x+bw/2} y1={cy(cv.h)} x2={x+bw/2} y2={cy(cv.l)} stroke={th.wk} strokeWidth="1"/>
            <rect x={x} y={cy(bot)} width={bw} height={bodyH} fill={fill} rx="1"/>
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
          <span style={{fontSize:13,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,color:"#888",letterSpacing:"0.1em"}}>CARD GENERATOR · {th.name.toUpperCase()}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#444",fontSize:20,cursor:"pointer",padding:"0 4px"}}>✕</button>
        </div>
        <canvas ref={canvasRef} style={{width:"100%",borderRadius:12,border:"1px solid rgba(255,255,255,0.06)"}}/>
        <div style={{display:"flex",gap:10,marginTop:16}}>
          <button onClick={download} style={{flex:1,padding:"13px",borderRadius:12,background:th.ac,color:"#000",border:"none",fontSize:13,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,cursor:"pointer",letterSpacing:"0.05em"}}>
            ↓ Download PNG (Twitter/Telegram ready)
          </button>
          <button onClick={onClose} style={{padding:"13px 20px",borderRadius:12,background:"rgba(255,255,255,0.05)",color:"#555",border:"1px solid rgba(255,255,255,0.08)",fontSize:13,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer"}}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function ChartSwatch({hex,label,glow}){
  const[cp,sc]=useState(false);
  const[pop,setPop]=useState(false);
  const b=hex.slice(0,7);
  const handleCopy=()=>{
    navigator.clipboard?.writeText(b);
    sc(true);setPop(true);
    setTimeout(()=>sc(false),1400);
    setTimeout(()=>setPop(false),400);
  };
  return(
    <div onClick={handleCopy}
      style={{display:"flex",flexDirection:"column",gap:6,alignItems:"center",cursor:"pointer",borderRadius:12,padding:"4px",transition:"background 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <div className={pop?"copy-pop":""} style={{width:"100%",height:36,borderRadius:10,background:hex,
        boxShadow:cp?`0 0 20px ${hex}80, 0 0 40px ${hex}30`:glow?`0 0 14px ${hex}50`:"0 2px 8px rgba(0,0,0,0.3)",
        border:cp?"2px solid rgba(255,255,255,0.6)":"2px solid rgba(255,255,255,0.08)",
        transition:"box-shadow 0.2s, border 0.15s",position:"relative",overflow:"hidden"}}>
        {cp&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.45)",fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#90e890",fontWeight:700,letterSpacing:"0.1em"}}>✓</div>}
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
    <div onClick={(ev)=>{
        navigator.clipboard?.writeText(b);sc(true);setTimeout(()=>sc(false),1400);if(window.__particleBurst)window.__particleBurst(ev.clientX,ev.clientY,hex.slice(0,7));
        // In-place floating copy confirmation
        const el=document.createElement('div');
        el.textContent='✓ '+b.toUpperCase();
        el.style.cssText='position:fixed;pointer-events:none;z-index:9999;padding:6px 12px;background:rgba(10,10,20,0.95);border:1px solid rgba(144,232,144,0.4);border-radius:20px;color:#90e890;font:600 11px JetBrains Mono,monospace;letter-spacing:0.08em;transform:translateY(0);opacity:1;transition:all 0.6s ease;white-space:nowrap;';
        el.style.left=(ev.clientX-40)+'px';el.style.top=(ev.clientY-36)+'px';
        document.body.appendChild(el);
        requestAnimationFrame(()=>{el.style.transform='translateY(-20px)';el.style.opacity='0';});
        setTimeout(()=>el.remove(),700);
      }}
      onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.paddingLeft="20px";}}
      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.paddingLeft="16px";}}
      style={{display:"flex",alignItems:"center",gap:16,padding:"12px 16px",borderRadius:10,cursor:"pointer",transition:"all 0.15s",marginBottom:3}}>
      <div style={{width:44,height:isLine?6:24,borderRadius:isLine?3:8,background:hex,flexShrink:0,boxShadow:`0 2px 14px ${hex}55`,transition:"box-shadow 0.2s, width 0.15s"}}/>
      <div style={{flex:1}}>
        <div style={{fontSize:14,color:"#e8e0d8",fontWeight:500,fontFamily:"'Space Grotesk',sans-serif"}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:"#666",marginTop:2,fontFamily:"'JetBrains Mono',monospace"}}>{sub}</div>}
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
  {[[ic.fvg,"FVG — Fair Value Gap","Entry model — fill zone"],[ic.ifvg,"IFVG — Inverse FVG","Reversal — retrace into FVG"],[ic.ote,"OTE — Optimal Trade Entry","0.62–0.79 fib zone"],[ic.silverBullet,"Silver Bullet","10:00–11:00 EST"]].map(([h,l,s])=><ColorRow key={l} hex={h} label={l} sub={s} isLine={false}/>)}
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
  {[[z.orderBlock,"Order Block"],[z.equilibrium,"Equilibrium Zone"]].map(([h,l])=><ColorRow key={l} hex={h} label={l} isLine={false}/>)}
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

// ─── KIT OF THE DAY ──────────────────────────────────────────────────────────
const getKOTD=()=>{const d=Math.floor(Date.now()/86400000);return THEMES[d%THEMES.length].id;};

// ─── SEASONAL DROPS ──────────────────────────────────────────────────────────
const getSeason=()=>{const m=new Date().getMonth();if(m>=2&&m<=4)return'spring';if(m>=5&&m<=7)return'summer';if(m>=8&&m<=10)return'autumn';return'winter';};
const SEASONAL={spring:{id:'sakurabloom',label:'🌸 Spring Drop',color:'#ff70a0'},summer:{id:'fire',label:'☀️ Bull Season',color:'#ff8030'},autumn:{id:'honey',label:'🍂 Harvest Drop',color:'#c07820'},winter:{id:'eclipse',label:'❄️ Bear Cave',color:'#806898'}};

// ─── COMPARE MODAL ───────────────────────────────────────────────────────────
function CompareModal({th1,th2,fam1,fam2,glow1,glow2,onClose}){
  const KitPanel=({th,fam,glow,label})=>(
    <div style={{flex:1,borderRadius:16,overflow:"hidden",background:SBGS[th.id]||PHANTOM_SBGS[th.id]||th.bg,border:`1px solid ${th.ac}55`,boxShadow:`0 8px 32px ${th.ac}20`}}>
      <div style={{padding:"20px 18px"}}>
        <div style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:th.ac,letterSpacing:"0.3em",marginBottom:6,textShadow:glow?`0 0 12px ${th.ac}`:"none"}}>{label}</div>
        <div style={{fontSize:28,fontWeight:800,fontFamily:"'Space Grotesk',sans-serif",color:"#f0f0f0",lineHeight:1,marginBottom:6}}>{th.name}</div>
        <div style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",color:"#333",letterSpacing:"0.1em",marginBottom:16}}>{th.tag.toUpperCase()}</div>
        <div style={{display:"flex",gap:8,marginBottom:14,padding:"14px",background:"rgba(0,0,0,0.3)",borderRadius:10,width:"fit-content"}}>
          <Cube th={th} glow={glow} size={60}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
          {[["OPENS",fam.opens],["HIGHS",fam.highs],["LOWS",fam.lows],["MIDS",fam.mids]].map(([l,col])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 9px",borderRadius:8,background:`${col}12`,border:`1px solid ${col}25`}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:col,boxShadow:`0 0 8px ${col}`}}/>
              <span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",color:col,fontWeight:700}}>{l}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:5}}>
          {Object.entries(th.chart).map(([k,s])=>(
            <div key={k} style={{flex:1,height:22,borderRadius:5,background:s.hex,border:"1px solid rgba(255,255,255,0.1)"}}/>
          ))}
        </div>
      </div>
    </div>
  );
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{background:"#0a0a12",borderRadius:24,padding:28,border:"1px solid rgba(255,255,255,0.08)",maxWidth:800,width:"100%",animation:"fadeUp 0.3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontSize:13,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,color:"#555",letterSpacing:"0.1em"}}>KIT COMPARE</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#333",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",gap:14}}>
          <KitPanel th={th1} fam={fam1} glow={glow1} label="KIT A"/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"0 8px",color:"#222",fontSize:20,fontWeight:800,fontFamily:"'Space Grotesk',sans-serif",flexShrink:0}}>VS</div>
          <KitPanel th={th2} fam={fam2} glow={glow2} label="KIT B"/>
        </div>
        <div style={{marginTop:16,fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:"#282828",textAlign:"center",letterSpacing:"0.1em"}}>Select a second kit from the grid to compare</div>
      </div>
    </div>
  );
}

// ─── KEYBOARD SHORTCUTS MODAL ─────────────────────────────────────────────────
function KBModal({onClose,ac}){
  const shortcuts=[["R","Random kit"],["F","Favorite / unfavorite"],["← / →","Previous / next kit"],["1 – 6","Switch tool tab"],["C","Compare mode toggle"],["Esc","Close modals / clear search"]];
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{background:"#0a0a12",borderRadius:20,padding:28,border:"1px solid rgba(255,255,255,0.08)",maxWidth:380,width:"100%",animation:"fadeUp 0.3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
          <span style={{fontSize:13,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,color:"#555",letterSpacing:"0.1em"}}>⌨ KEYBOARD SHORTCUTS</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#333",fontSize:18,cursor:"pointer"}}>✕</button>
        </div>
        {shortcuts.map(([key,desc])=>(
          <div key={key} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{minWidth:72,padding:"4px 10px",borderRadius:7,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:ac,textAlign:"center",letterSpacing:"0.05em"}}>{key}</div>
            <span style={{fontSize:13,fontFamily:"'Space Grotesk',sans-serif",color:"#444"}}>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── UTILITY: CONTRAST + SIMILARITY ─────────────────────────────────────────
const getLum=(hex)=>{if(!hex||hex.length<7)return 0;const r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;const l=c=>c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);return 0.2126*l(r)+0.7152*l(g)+0.0722*l(b);};
const getContrast=(h1,h2)=>{try{const l1=getLum(h1||'#000'),l2=getLum(h2||'#000'),hi=Math.max(l1,l2),lo=Math.min(l1,l2);return((hi+0.05)/(lo+0.05));}catch(e){return 1;}};
const contrastBadge=(ratio)=>{if(ratio>=7)return{label:"AAA",color:"#20c870"};if(ratio>=4.5)return{label:"AA",color:"#60b8ff"};if(ratio>=3)return{label:"AA-",color:"#f0c830"};return{label:"LOW",color:"#e85050"};};
const colorDist=(h1,h2)=>{if(!h1||!h2)return 999;const p=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];const [r1,g1,b1]=p(h1),[r2,g2,b2]=p(h2);return Math.sqrt((r1-r2)**2+(g1-g2)**2+(b1-b2)**2);};
const getReadable=(bg)=>{
  if(!bg||bg.length<7)return '#f0ece6';
  const r=parseInt(bg.slice(1,3),16)/255,g=parseInt(bg.slice(3,5),16)/255,b=parseInt(bg.slice(5,7),16)/255;
  const lum=0.2126*r+0.7152*g+0.0722*b;
  return lum>0.4?'#0a0a0a':'#f0ece6';
};

const getSimilar=(th,palette,n=4)=>{try{const fam=th[palette];if(!fam)return[];return THEMES.filter(t=>t.id!==th.id).map(t=>{const f=t[palette]||t.match;return{t,d:colorDist(fam.opens,f.opens)+colorDist(fam.highs,f.highs)+colorDist(fam.lows,f.lows)+colorDist(fam.mids,f.mids)};}).sort((a,b)=>a.d-b.d).slice(0,n).map(x=>x.t);}catch(e){return[];}};

// ─── LIVE ANIMATED CHART ─────────────────────────────────────────────────────
// ─── LIVE ANIMATED CHART (SVG + setInterval — React-safe, no canvas crashes) ──
function LiveChart({th,fam,candleStyle='candles'}){
  const genCandles=(n=28)=>{let p=100;return Array.from({length:n},()=>{const o=p,m=(Math.random()-0.46)*2.2,cl=o+m,h=Math.max(o,cl)+Math.random()*1.2,l=Math.min(o,cl)-Math.random()*1.2;p=cl;return{o,h,l,c:cl};});};
  // Use ref + single forceUpdate — avoids calling setState inside setState updater (crashes React)
  const dataRef=useRef({candles:genCandles(),live:{o:100,h:101,l:99,c:100}});
  const[,forceUpdate]=useState(0);
  const tickRef=useRef(0);

  useEffect(()=>{
    const id=setInterval(()=>{
      tickRef.current++;
      const{candles,live}=dataRef.current;
  // Guard against NaN prices
  const safeNum=(n,fallback=100)=>isFinite(n)?n:fallback;
      const noise=(Math.random()-0.5)*0.5;
      const drift=Math.sin(tickRef.current*0.03)*0.12;
      const nc=Math.max(live.o-7,Math.min(live.o+7,live.c+noise+drift));
      const nh=Math.max(live.h,nc+Math.random()*0.25);
      const nl=Math.min(live.l,nc-Math.random()*0.25);
      if(tickRef.current%70===0){
        dataRef.current={candles:[...candles.slice(-27),live],live:{o:live.c,h:live.c,l:live.c,c:live.c}};
      } else {
        dataRef.current={candles,live:{...live,c:nc,h:nh,l:nl}};
      }
      forceUpdate(t=>t+1);
    },50);
    return()=>clearInterval(id);
  },[]);
  const{candles,live}=dataRef.current;
  // Guard against NaN prices
  const safeNum=(n,fallback=100)=>isFinite(n)?n:fallback;

  const W=280,H=130,pad=8;
  const all=[...candles,live];

  // Heikin Ashi transform
  let drawAll=all;
  if(candleStyle==='ha'){
    let haO=all[0].o,haC=all[0].c;
    drawAll=all.map(cv=>{const nc=(cv.o+cv.h+cv.l+cv.c)/4,no=(haO+haC)/2;haO=no;haC=nc;return{o:no,h:Math.max(cv.h,no,nc),l:Math.min(cv.l,no,nc),c:nc};});
  }

  const prices=drawAll.flatMap(cv=>[safeNum(cv.h),safeNum(cv.l)]);
  const minP=Math.min(...prices)-1,maxP=Math.max(...prices)+1,range=maxP-minP;
  const py=p=>pad+(H-pad*2)*(1-(p-minP)/range);
  const cw=W/drawAll.length,bw=Math.max(2,cw-2);
  const midP=(maxP+minP)/2;

  const renderCandle=(cv,i,isLive)=>{
    const x=i*cw;const bull=cv.c>=cv.o;const fill=bull?th.up:th.dn;
    const top=py(Math.max(cv.o,cv.c)),bot=py(Math.min(cv.o,cv.c)),bH=Math.max(1,bot-top);
    const glow=isLive?fill:"none";
    if(candleStyle==='bars') return(<g key={i}>
      <line x1={x+bw/2} y1={py(cv.h)} x2={x+bw/2} y2={py(cv.l)} stroke={fill} strokeWidth="1.5"/>
      <line x1={x} y1={py(cv.o)} x2={x+bw/2} y2={py(cv.o)} stroke={fill} strokeWidth="1.5"/>
      <line x1={x+bw/2} y1={py(cv.c)} x2={x+bw} y2={py(cv.c)} stroke={fill} strokeWidth="1.5"/>
    </g>);
    if(candleStyle==='hollow') return(<g key={i}>
      <line x1={x+bw/2} y1={py(cv.h)} x2={x+bw/2} y2={top} stroke={th.wk} strokeWidth="1"/>
      <line x1={x+bw/2} y1={bot} x2={x+bw/2} y2={py(cv.l)} stroke={th.wk} strokeWidth="1"/>
      <rect x={x+1} y={top} width={bw-1} height={bH} fill={bull?"transparent":fill} stroke={fill} strokeWidth={isLive?2:1.5} rx="1"/>
    </g>);
    return(<g key={i}>
      <line x1={x+bw/2} y1={py(cv.h)} x2={x+bw/2} y2={py(cv.l)} stroke={th.wk} strokeWidth="1"/>
      <rect x={x+1} y={top} width={bw-1} height={bH} fill={fill} rx="1"
        style={isLive?{filter:`drop-shadow(0 0 4px ${fill})`}:{}}/>
    </g>);
  };

  return(
    <div style={{borderRadius:10,overflow:"hidden",background:th.bg,border:"1px solid rgba(255,255,255,0.06)",position:"relative"}}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
        {[0.25,0.5,0.75].map(y=>(<line key={y} x1={0} y1={H*y} x2={W} y2={H*y} stroke={th.gr} strokeWidth="0.5" strokeOpacity="0.4"/>))}
        <line x1={0} y1={py(midP+range*0.18)} x2={W} y2={py(midP+range*0.18)} stroke={fam.highs} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.7"/>
        <line x1={0} y1={py(midP-range*0.18)} x2={W} y2={py(midP-range*0.18)} stroke={fam.lows} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.7"/>
        <line x1={0} y1={py(midP+range*0.02)} x2={W} y2={py(midP+range*0.02)} stroke={fam.opens} strokeWidth="1" strokeOpacity="0.8"/>
        {drawAll.map((cv,i)=>renderCandle(cv,i,i===drawAll.length-1))}
        <text x={W-2} y={py(midP+range*0.18)-2} fill={fam.highs} fontSize="6" textAnchor="end" opacity="0.8">PDH</text>
        <text x={W-2} y={py(midP-range*0.18)-2} fill={fam.lows} fontSize="6" textAnchor="end" opacity="0.8">PDL</text>
        <text x={W-2} y={py(midP+range*0.02)-2} fill={fam.opens} fontSize="6" textAnchor="end" opacity="0.9">dOpen</text>
      </svg>
      <div style={{position:"absolute",top:6,right:6,display:"flex",alignItems:"center",gap:4}}>
        <div style={{width:5,height:5,borderRadius:"50%",background:"#20c870",boxShadow:"0 0 6px #20c870",animation:"pulseGlow 1.5s ease-in-out infinite"}}/>
        <span style={{fontSize:7,fontFamily:"'JetBrains Mono',monospace",color:"#20c87088",letterSpacing:"0.1em"}}>LIVE</span>
      </div>
      <div style={{padding:"4px 10px",fontSize:8,fontFamily:"'JetBrains Mono',monospace",color:"#2a2a2a",letterSpacing:"0.1em",background:"rgba(0,0,0,0.15)"}}>ANIMATED PREVIEW · {th.name}</div>
    </div>
  );
}


// ─── FULLSCREEN CHART MODAL ───────────────────────────────────────────────────
function FullscreenChart({th,fam,onClose,candleStyle='candles',setCandleStyle}){
  const styleRef=useRef(candleStyle);
  useEffect(()=>{styleRef.current=candleStyle;},[candleStyle]);
  const canvasRef=useRef(null);
  const[zoom,setZoom]=useState(1);
  const stateRef=useRef({candles:[],live:{o:0,h:0,l:0,c:0}});

  useEffect(()=>{
    let price=100;const candles=[];
    for(let i=0;i<48;i++){
      const o=price,mov=(Math.random()-0.46)*2.5;
      const c=o+mov,h=Math.max(o,c)+Math.random()*1.5,l=Math.min(o,c)-Math.random()*1.5;
      candles.push({o,h,l,c});price=c;
    }
    stateRef.current.candles=candles;
    stateRef.current.live={o:price,h:price+1,l:price-1,c:price};

    const canvas=canvasRef.current;if(!canvas)return;
    let raf,tick=0;
    const draw=()=>{
      tick++;
      const s=stateRef.current;
      const noise=(Math.random()-0.5)*0.4,drift=Math.sin(tick*0.025)*0.12;
      s.live.c=Math.max(s.live.o-8,Math.min(s.live.o+8,s.live.c+noise+drift*0.1));
      s.live.h=Math.max(s.live.h,s.live.c+Math.random()*0.2);
      s.live.l=Math.min(s.live.l,s.live.c-Math.random()*0.2);
      if(tick%200===0){s.candles.push({...s.live});if(s.candles.length>48)s.candles.shift();const newO=s.live.c;s.live={o:newO,h:newO,l:newO,c:newO};}

      const dpr=window.devicePixelRatio||1;
      const W=canvas.clientWidth,H=canvas.clientHeight;
      if(canvas.width!==W*dpr){canvas.width=W*dpr;canvas.height=H*dpr;}
      const ctx=canvas.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);

      const visCount=Math.round(48/zoom);
      const allC=[...s.candles.slice(-visCount+1),s.live];
      const prices=allC.flatMap(c=>[c.h,c.l]);
      const minP=Math.min(...prices)-2,maxP=Math.max(...prices)+2,range=maxP-minP;
      const padL=60,padR=70,padT=30,padB=30;
      const cW=W-padL-padR,cH=H-padT-padB;
      const py=p=>padT+cH-(((p-minP)/range)*cH);

      // Background
      ctx.fillStyle=th.bg;ctx.fillRect(0,0,W,H);

      // Grid + price labels
      ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=0.5;ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='10px monospace';
      for(let i=0;i<=5;i++){
        const p=minP+(range*i/5);const y=py(p);
        ctx.beginPath();ctx.moveTo(padL,y);ctx.lineTo(padL+cW,y);ctx.stroke();
        ctx.fillText(p.toFixed(2),padL+cW+4,y+4);
      }

      // Key levels with fills
      const pdh=maxP-range*0.08,pdl=minP+range*0.08,dOpen=minP+range*0.48,wOpen=minP+range*0.55,vwap=minP+range*0.5;
      const levels=[
        [fam.highs,pdh,"PDH",true],[fam.lows,pdl,"PDL",true],
        [fam.opens,dOpen,"dOpen",false],[fam.opens,wOpen,"wOpen",false],
        [fam.mids,vwap,"VWAP",false]
      ];
      levels.forEach(([col,p,label,dashed])=>{
        const y=py(p);
        ctx.strokeStyle=col;ctx.lineWidth=1.5;
        ctx.setLineDash(dashed?[6,4]:[0]);
        ctx.beginPath();ctx.moveTo(padL,y);ctx.lineTo(padL+cW,y);ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle=col;ctx.font='bold 10px monospace';ctx.fillText(label,4,y+4);
      });

      // Zone fills
      [[fam.highs,pdh-range*0.05,pdh],[fam.lows,pdl,pdl+range*0.05]].forEach(([col,lo,hi])=>{
        ctx.fillStyle=col+'18';ctx.fillRect(padL,py(hi),cW,py(lo)-py(hi));
      });

      // Candles
      const bw2=Math.max(3,Math.floor(cW/allC.length)-2);
      const cs2=styleRef.current;
      let drawC2=allC;
      if(cs2==='ha'){let haO=allC[0].o,haC=allC[0].c;drawC2=allC.map(cv=>{const nc=(cv.o+cv.h+cv.l+cv.c)/4,no=(haO+haC)/2;haO=no;haC=nc;return{o:no,h:Math.max(cv.h,no,nc),l:Math.min(cv.l,no,nc),c:nc};});}
      drawC2.forEach((cv2,i)=>{
        const x=padL+i*(cW/allC.length);const bull=cv2.c>=cv2.o;
        const fill=bull?th.up:th.dn;const isLive=i===drawC2.length-1;
        if(isLive){ctx.shadowColor=fill;ctx.shadowBlur=12;}
        if(cs2==='bars'){
          ctx.strokeStyle=fill;ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(x+bw2/2,py(cv2.h));ctx.lineTo(x+bw2/2,py(cv2.l));ctx.stroke();
          ctx.beginPath();ctx.moveTo(x,py(cv2.o));ctx.lineTo(x+bw2/2,py(cv2.o));ctx.stroke();
          ctx.beginPath();ctx.moveTo(x+bw2/2,py(cv2.c));ctx.lineTo(x+bw2,py(cv2.c));ctx.stroke();
        } else {
          ctx.strokeStyle=th.wk;ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(x+bw2/2,py(cv2.h));ctx.lineTo(x+bw2/2,py(cv2.l));ctx.stroke();
          const top=py(Math.max(cv2.o,cv2.c)),bodyH=Math.max(1,py(Math.min(cv2.o,cv2.c))-top);
          if(cs2==='hollow'&&bull){ctx.strokeStyle=fill;ctx.lineWidth=1.5;ctx.strokeRect(x,top,bw2,bodyH);}
          else{ctx.fillStyle=fill;ctx.fillRect(x,top,bw2,bodyH);}
        }
        ctx.shadowBlur=0;
      });

      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(raf);
  },[th.id,zoom]);

  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,0.94)",display:"flex",flexDirection:"column",animation:"fadeUp 0.3s ease"}} onClick={onClose}>
      <div style={{display:"flex",alignItems:"center",gap:16,padding:"14px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:8,height:8,borderRadius:"50%",background:"#20c870",boxShadow:"0 0 8px #20c870",animation:"pulseGlow 1.5s ease-in-out infinite"}}/>
        <span style={{fontSize:12,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,color:"#555",letterSpacing:"0.1em",flex:1}}>{th.name.toUpperCase()} · LIVE CHART · {th.tag.toUpperCase()}</span>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#2a2a2a",letterSpacing:"0.1em"}}>STYLE</span>
          {[['candles','▊'],['hollow','▯'],['ha','HA'],['bars','|']].map(([style,icon])=>(
            <button key={style} onClick={()=>setCandleStyle&&setCandleStyle(style)} title={style} style={{padding:"5px 10px",borderRadius:8,background:candleStyle===style?"rgba(255,255,255,0.14)":"rgba(255,255,255,0.04)",border:`1px solid ${candleStyle===style?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.07)"}`,color:candleStyle===style?"#fff":"#444",fontSize:11,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",fontWeight:candleStyle===style?"700":"400"}}>
              {icon}
            </button>
          ))}
          <div style={{width:1,height:20,background:"rgba(255,255,255,0.08)",margin:"0 4px"}}/>
          <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#2a2a2a",letterSpacing:"0.1em"}}>ZOOM</span>
          {[0.5,1,1.5,2].map(z=>(
            <button key={z} onClick={()=>setZoom(z)} style={{padding:"5px 10px",borderRadius:8,background:zoom===z?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.04)",border:`1px solid ${zoom===z?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.07)"}`,color:zoom===z?"#fff":"#444",fontSize:10,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer"}}>
              {z}x
            </button>
          ))}
          <button onClick={onClose} style={{marginLeft:8,background:"none",border:"none",color:"#333",fontSize:20,cursor:"pointer",padding:"0 4px"}}>✕</button>
        </div>
      </div>
      <div style={{flex:1,padding:16}} onClick={e=>e.stopPropagation()}>
        <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block",borderRadius:12,border:"1px solid rgba(255,255,255,0.06)"}}/>
      </div>
    </div>
  );
}


// ─── CHANGELOG ───────────────────────────────────────────────────────────────
const CHANGELOG_VERSION = "2.0";
const CHANGELOG = [
  { version:"2.0", date:"Apr 2026", items:[
    "🏆 115 kits total — 16 new added in May 2026 (BURGUNDY, TERRA, ARCTIC, ONYX, DAWN RISE, CASINO, RADIOACTIVE, HACKER, INSTITUTIONAL, QUANT, DRAGON BALL, HUNTER X, DOUBLE BUBBLE, WATERMELON, POLAR NIGHT, SAHARA)",
    "📊 Candle style switcher — Candles, Hollow, Heikin Ashi, Bars",
    "📺 Animated live chart with fullscreen mode",
    "☀ Dark / light site mode toggle",
    "✦ Kits Like This — similar kit suggestions",
    "🏷 Contrast ratio badge on every kit card",
    "⌨ Keyboard shortcuts (R, F, ← →, 1-6, C)",
    "⚡ Compare mode — side by side kit comparison",
    "🏆 Kit of the Day + 🌟 Seasonal drops",
    "⏱ Recently viewed kits",
    "👍 Community ratings",
  ]},
];

function ChangelogModal({onClose,ac}){
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{background:"#0a0a12",borderRadius:24,padding:28,border:"1px solid rgba(255,255,255,0.08)",maxWidth:480,width:"100%",animation:"fadeUp 0.3s ease",maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div>
            <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:ac,letterSpacing:"0.2em",marginBottom:4}}>✦ WHAT'S NEW</div>
            <div style={{fontSize:22,fontWeight:800,fontFamily:"'Space Grotesk',sans-serif",color:"#f0f0f0"}}>Version {CHANGELOG_VERSION}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#333",fontSize:20,cursor:"pointer",alignSelf:"flex-start"}}>✕</button>
        </div>
        {CHANGELOG.map(v=>(
          <div key={v.version} style={{marginTop:20}}>
            <div style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#333",letterSpacing:"0.15em",marginBottom:12,paddingBottom:8,borderBottom:"1px solid rgba(255,255,255,0.05)"}}>{v.date}</div>
            {v.items.map((item,i)=>{const chars=Array.from(item);const icon=chars[0];const text=chars.slice(2).join('');return(
              <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                <span style={{fontSize:13,flexShrink:0}}>{icon}</span>
                <span style={{fontSize:12,fontFamily:"'Space Grotesk',sans-serif",color:"#555",lineHeight:1.5}}>{text}</span>
              </div>
            );})}
          </div>
        ))}
        <button onClick={onClose} style={{marginTop:20,width:"100%",padding:"12px",borderRadius:12,background:ac,color:"#000",border:"none",fontSize:12,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,cursor:"pointer",letterSpacing:"0.06em"}}>
          Let's go ✦
        </button>
      </div>
    </div>
  );
}


// ─── ACCESSIBILITY HEATMAP ────────────────────────────────────────────────────
function AccessibilityHeatmap({th,fam}){
  const pairs=[
    {a:th.up,  b:th.bg,  la:"Up Candle",   lb:"Background"},
    {a:th.dn,  b:th.bg,  la:"Down Candle",  lb:"Background"},
    {a:th.up,  b:th.dn,  la:"Up Candle",    lb:"Down Candle"},
    {a:fam.highs,b:th.bg,la:"PDH / Resist", lb:"Background"},
    {a:fam.lows, b:th.bg,la:"PDL / Support",lb:"Background"},
    {a:fam.opens,b:th.bg,la:"Opens / Ref",  lb:"Background"},
    {a:th.tx,  b:th.bg,  la:"Text",         lb:"Background"},
    {a:fam.highs,b:fam.lows,la:"Highs",     lb:"Lows"},
  ];
  return(
    <div style={{marginTop:12}}>
      <div style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#282828",letterSpacing:"0.2em",marginBottom:8}}>CONTRAST HEATMAP</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
        {pairs.map((p,i)=>{
          const r=getContrast(p.a,p.b);
          const b=contrastBadge(r);
          return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",borderRadius:8,background:`${b.color}0c`,border:`1px solid ${b.color}28`,animation:"cardEntrance 0.3s "+i*60+"ms both"}}>
              <div style={{display:"flex",gap:3,flexShrink:0}}>
                <div style={{width:12,height:12,borderRadius:3,background:p.a,border:"1px solid rgba(255,255,255,0.1)"}}/>
                <div style={{width:12,height:12,borderRadius:3,background:p.b,border:"1px solid rgba(255,255,255,0.1)"}}/>
              </div>
              <div style={{flex:1,minWidth:0,overflow:"hidden"}}>
                <div style={{fontSize:7,color:"#444",fontFamily:"'JetBrains Mono',monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.2}}>{p.la}</div>
                <div style={{fontSize:6,color:"#333",fontFamily:"'JetBrains Mono',monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",opacity:0.7,lineHeight:1.2}}>vs {p.lb}</div>
              </div>
              <div style={{flexShrink:0,padding:"2px 4px",borderRadius:4,background:`${b.color}20`,fontSize:6.5,fontFamily:"'JetBrains Mono',monospace",color:b.color,fontWeight:700,whiteSpace:"nowrap"}}>{b.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ─── CUBE SCREENSAVER ─────────────────────────────────────────────────────────
function Screensaver({themes,onExit}){
  const[idx,setIdx]=useState(0);
  const[rot,setRot]=useState(0);
  useEffect(()=>{
    // Cycle through themes every 3s
    const tid=setInterval(()=>setIdx(i=>(i+1)%themes.length),3000);
    return()=>clearInterval(tid);
  },[]);
  useEffect(()=>{
    const style=document.createElement('style');
    style.innerHTML=`@keyframes ss-spin{from{transform:rotateX(-18deg) rotateY(0deg)}to{transform:rotateX(-18deg) rotateY(360deg)}}`;
    document.head.appendChild(style);
    return()=>style.remove();
  },[]);
  const th=themes[idx];
  const s=180;const h=s/2;
  const faces=[
    {bg:th.up,t:`translateZ(${h}px)`,o:1.0},
    {bg:th.dn,t:`rotateY(180deg) translateZ(${h}px)`,o:0.55},
    {bg:th.ac,t:`rotateY(90deg) translateZ(${h}px)`,o:0.8},
    {bg:th.wk,t:`rotateY(-90deg) translateZ(${h}px)`,o:0.65},
    {bg:th.sf,t:`rotateX(90deg) translateZ(${h}px)`,o:0.85},
    {bg:th.bg,t:`rotateX(-90deg) translateZ(${h}px)`,o:0.4},
  ];
  const SBGS2=typeof SBGS!=='undefined'?SBGS:{};
  const PHANTOM_SBGS2=typeof PHANTOM_SBGS!=='undefined'?PHANTOM_SBGS:{};
  const bg=SBGS2[th.id]||PHANTOM_SBGS2[th.id]||th.bg;
  return(
    <div onClick={onExit} style={{position:"fixed",inset:0,zIndex:9999,background:bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 1.5s ease"}}>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at center, ${th.ac}15 0%, transparent 65%)`}}/>
      <div style={{width:s,height:s,perspective:900,perspectiveOrigin:"50% 55%",marginBottom:40}}>
        <div style={{width:s,height:s,position:"relative",transformStyle:"preserve-3d",animation:"ss-spin 6s linear infinite"}}>
          {faces.map((f,i)=>{const lc=["cube-face-top","cube-face-front","cube-face-right","cube-face-left","cube-face-back","cube-face-bottom"][i]||"";return(<div key={i} className={lc} style={{position:"absolute",width:s,height:s,background:f.bg,transform:f.t,border:"1px solid rgba(255,255,255,0.1)",backfaceVisibility:"hidden",boxShadow:glow?"inset 0 0 20px "+f.bg+"40":""}}/>);})}
        </div>
      </div>
      <div style={{fontSize:14,fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,color:th.ac,letterSpacing:"0.2em",marginBottom:6,textShadow:`0 0 30px ${th.ac}80`,transition:"color 1.5s ease"}}>{th.name}</div>
      <div style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#333",letterSpacing:"0.15em",marginBottom:32}}>{th.tag.toUpperCase()}</div>
      <div style={{display:"flex",gap:6}}>
        {themes.map((t,i)=>(<div key={t.id} style={{width:i===idx?24:6,height:6,borderRadius:3,background:i===idx?th.ac:"rgba(255,255,255,0.1)",transition:"all 0.5s ease"}}/>))}
      </div>
      <div style={{position:"absolute",bottom:24,fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#1a1a1a",letterSpacing:"0.2em"}}>TAP ANYWHERE TO EXIT</div>
    </div>
  );
}


// ─── KIT AURA BACKGROUND ──────────────────────────────────────────────────────
function KitAura({th}){
  const canvasRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext('2d');
    canvas.width=600;canvas.height=600;
    // Parse accent color
    const hex=th.ac.slice(1);
    const r=parseInt(hex.slice(0,2),16)/255;
    const g=parseInt(hex.slice(2,4),16)/255;
    const b=parseInt(hex.slice(4,6),16)/255;
    // Draw procedural noise using layered circles
    ctx.clearRect(0,0,600,600);
    const seed=th.id.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
    const rnd=(s)=>{let x=Math.sin(s)*10000;return x-Math.floor(x);};
    for(let i=0;i<18;i++){
      const sx=rnd(seed+i*7)*600,sy=rnd(seed+i*13)*600;
      const sr=60+rnd(seed+i*3)*180;
      const sa=0.015+rnd(seed+i*11)*0.035;
      const gr=ctx.createRadialGradient(sx,sy,0,sx,sy,sr);
      gr.addColorStop(0,`rgba(${Math.round(r*255)},${Math.round(g*255)},${Math.round(b*255)},${sa})`);
      gr.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=gr;ctx.fillRect(0,0,600,600);
    }
    // Second layer with kit's secondary colors
    const hex2=th.up.slice(1);
    const r2=parseInt(hex2.slice(0,2)||'80',16)/255;
    const g2=parseInt(hex2.slice(2,4)||'80',16)/255;
    const b2=parseInt(hex2.slice(4,6)||'80',16)/255;
    for(let i=0;i<8;i++){
      const sx=rnd(seed+i*17+50)*600,sy=rnd(seed+i*23+50)*600;
      const sr=40+rnd(seed+i*5+50)*120;
      const gr=ctx.createRadialGradient(sx,sy,0,sx,sy,sr);
      gr.addColorStop(0,`rgba(${Math.round(r2*255)},${Math.round(g2*255)},${Math.round(b2*255)},0.02)`);
      gr.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=gr;ctx.fillRect(0,0,600,600);
    }
  },[th.id]);
  return(
    <canvas ref={canvasRef} style={{position:"fixed",top:"10%",left:"50%",transform:"translateX(-50%)",width:600,height:600,pointerEvents:"none",zIndex:0,opacity:0.6,filter:"blur(40px)",transition:"opacity 0.8s ease"}}/>
  );
}


// ─── 3D TILT HOOK ─────────────────────────────────────────────────────────────
function useTilt(strength=12){
  const ref=useRef(null);
  const handleMove=useCallback((e)=>{
    const el=ref.current;if(!el)return;
    const r=el.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-0.5)*2;
    const y=((e.clientY-r.top)/r.height-0.5)*2;
    el.style.transform=`perspective(600px) rotateY(${x*strength}deg) rotateX(${-y*strength}deg) scale(1.03)`;
  },[strength]);
  const handleLeave=useCallback(()=>{
    const el=ref.current;if(!el)return;
    el.style.transform=`perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)`;
  },[]);
  return{ref,onMouseMove:handleMove,onMouseLeave:handleLeave};
}

// ─── COMMAND PALETTE ──────────────────────────────────────────────────────────
function CommandPalette({themes,onSelect,onClose,palette,favs,toggleFav,randomKit,ac}){
  const[query,setQuery]=useState('');
  const[sel,setSel]=useState(0);
  const inputRef=useRef(null);
  useEffect(()=>{inputRef.current?.focus();},[]);

  const commands=[
    {type:'action',label:'Random Kit',icon:'🎲',action:()=>{randomKit();onClose();}},
    {type:'action',label:'Toggle Favorites View',icon:'❤️',action:()=>{onClose();}},
    {type:'action',label:'Switch to MATCH palette',icon:'◉',action:()=>{onClose();}},
    {type:'action',label:'Switch to VIVID palette',icon:'◈',action:()=>{onClose();}},
  ];
  const kitResults=query.length>0
    ?themes.filter(t=>t.name.toLowerCase().includes(query.toLowerCase())||t.cat.toLowerCase().includes(query.toLowerCase())||t.tag.toLowerCase().includes(query.toLowerCase())).slice(0,7)
    :[];
  const allResults=[...commands.filter(c=>!query||c.label.toLowerCase().includes(query.toLowerCase())),...kitResults.map(t=>({type:'kit',t}))];
  const total=allResults.length;

  const exec=(item)=>{
    if(item.type==='action'){item.action();}
    else if(item.type==='kit'){onSelect(item.t.id);onClose();}
  };

  useEffect(()=>{setSel(0);},[query]);

  const onKey=(e)=>{
    if(e.key==='ArrowDown'){e.preventDefault();setSel(s=>Math.min(s+1,total-1));}
    else if(e.key==='ArrowUp'){e.preventDefault();setSel(s=>Math.max(s-1,0));}
    else if(e.key==='Enter'&&allResults[sel]){exec(allResults[sel]);}
    else if(e.key==='Escape'){onClose();}
  };

  return(
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-box" onClick={e=>e.stopPropagation()}>
        {/* Input */}
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 18px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <span style={{fontSize:16,color:'#333'}}>⌕</span>
          <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={onKey}
            placeholder="Search kits, categories, commands..."
            style={{flex:1,background:'none',border:'none',outline:'none',fontSize:15,color:'#e0e0e0',fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'0.01em'}}/>
          <kbd style={{padding:'2px 7px',borderRadius:5,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'#333'}}>ESC</kbd>
        </div>
        {/* Results */}
        <div style={{maxHeight:360,overflowY:'auto',padding:'6px'}}>
          {allResults.length===0&&<div style={{padding:'24px',textAlign:'center',color:'#2a2a2a',fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>No results for "{query}"</div>}
          {allResults.map((item,i)=>{
            const active=i===sel;
            if(item.type==='action') return(
              <div key={item.label} onClick={()=>exec(item)} onMouseEnter={()=>setSel(i)}
                style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',borderRadius:8,cursor:'pointer',background:active?'rgba(255,255,255,0.07)':'transparent',transition:'background 0.1s'}}>
                <span style={{fontSize:14,width:20,textAlign:'center',flexShrink:0}}>{item.icon}</span>
                <span style={{fontSize:13,color:active?'#e0e0e0':'#555',fontFamily:"'Space Grotesk',sans-serif"}}>{item.label}</span>
                {active&&<kbd style={{marginLeft:'auto',padding:'2px 6px',borderRadius:4,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:'#333'}}>↵</kbd>}
              </div>
            );
            const t=item.t;
            return(
              <div key={t.id} onClick={()=>exec(item)} onMouseEnter={()=>setSel(i)}
                style={{display:'flex',alignItems:'center',gap:12,padding:'8px 12px',borderRadius:8,cursor:'pointer',background:active?'rgba(255,255,255,0.07)':'transparent',transition:'background 0.1s'}}>
                <div style={{display:'flex',gap:3,flexShrink:0}}>
                  <div style={{width:14,height:14,borderRadius:3,background:t.up}}/>
                  <div style={{width:14,height:14,borderRadius:3,background:t.dn}}/>
                </div>
                <div style={{flex:1}}>
                  <span style={{fontSize:13,color:active?'#e0e0e0':'#555',fontFamily:"'Space Grotesk',sans-serif",fontWeight:600}}>{t.name}</span>
                  <span style={{fontSize:10,color:'#2a2a2a',fontFamily:"'JetBrains Mono',monospace",marginLeft:8}}>{t.cat}</span>
                </div>
                <div style={{display:'flex',gap:4}}>
                  {[t[palette].opens,t[palette].highs,t[palette].lows,t[palette].mids].map((col,ci)=>(
                    <div key={ci} style={{width:6,height:6,borderRadius:'50%',background:col}}/>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {/* Footer */}
        <div style={{padding:'8px 18px',borderTop:'1px solid rgba(255,255,255,0.04)',display:'flex',gap:16,alignItems:'center'}}>
          {[['↑↓','Navigate'],['↵','Select'],['esc','Close']].map(([k,d])=>(
            <div key={k} style={{display:'flex',alignItems:'center',gap:5}}>
              <kbd style={{padding:'2px 6px',borderRadius:4,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:'#444'}}>{k}</kbd>
              <span style={{fontSize:10,color:'#282828',fontFamily:"'JetBrains Mono',monospace"}}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROAST MY COLORS ──────────────────────────────────────────────────────────
const ROASTS={
  ember:"Classic. You've been trading since before most people knew what a candle was. You don't chase. You wait. You've seen it all.",
  obsidian:"You only trade black and white. No emotions. Probably profitable. Definitely no friends at the bar.",
  matrix:"You found 'alpha' in a YouTube comment at 2AM and never looked back. Somehow it worked.",
  bloodmoon:"You buy the top and blame smart money. Your stop loss is 'just below the wick.' You've said 'this is the bottom' six times this month.",
  sol:"You aped in at $260 and told your family it was a sure thing. Now you're DCAing and calling it a strategy.",
  uranium:"You're either printing money or completely cooked. There is no in between. We respect it.",
  fire:"You've been saying 'we're so back' since last Tuesday. You have not left the charts in 4 days.",
  bitcoin:"HODL. That's your entire strategy. You've never sold. You'll never sell. You'll die with this.",
  pepe:"You turned $100 into $40,000 and then back into $100. You called it 'the experience.' You're going to do it again.",
  ghost:"You post once a month. It's always right. Nobody knows who you are. You prefer it that way.",
  anon:"You have seventeen accounts. None of them are verified. All of them are correct.",
  void:"You trade the 1-minute chart at 3AM with a red light bulb on. This is fine.",
  synthwave:"You've automated everything except knowing when to stop.",
  noir:"You print your charts in black and white and frame them. You've read every trading book. You still revenge trade.",
  graphite:"You've been waiting for the pullback since 2021. Still waiting. Very disciplined.",
  linen:"You have a 12-step morning routine before opening your charts. Your journal has a leather cover.",
  cottoncandy:"Your stop loss is a suggestion and your take profit is 'whenever it feels right.'",
  bubblegumpop:"You entered at market open based on vibes and called it confluence.",
  acid:"You've backtested 300 strategies. You live-trade none of them.",
  glitch:"You found a 'bug' in the market and are now the most confident person in any chat.",
  darkroom:"You only chart late at night. The red light helps you think. You're probably right.",
  shohen:"YOUR ENTRY WAS PERFECT. YOU WILL NOT TAKE PROFIT EARLY. THIS IS YOUR MOMENT.",
  default:"You have an opinion on every setup and a position on nothing. Impressive range, zero accountability.",
};
function RoastModal({th,onClose}){
  const roast=ROASTS[th.id]||ROASTS.default;
  const[revealed,setRevealed]=useState(false);
  return(
    <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,0.9)',display:'flex',alignItems:'center',justifyContent:'center',padding:24,backdropFilter:'blur(12px)'}} onClick={onClose}>
      <div style={{background:'#0a0a14',borderRadius:24,padding:36,border:'1px solid rgba(255,255,255,0.08)',maxWidth:460,width:'100%',animation:'kitIn 0.3s ease'}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'#333',letterSpacing:'0.2em',marginBottom:12}}>🔥 ROAST MY COLORS</div>
        <div style={{fontSize:13,fontFamily:"'JetBrains Mono',monospace",color:th.ac,letterSpacing:'0.2em',marginBottom:6}}>{th.name.toUpperCase()}</div>
        {!revealed?(
          <button onClick={()=>setRevealed(true)} style={{width:'100%',padding:'14px',borderRadius:12,background:`${th.ac}22`,color:th.ac,border:`1px solid ${th.ac}44`,fontSize:13,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,cursor:'pointer',letterSpacing:'0.05em',marginTop:12}}>
            Roast me 🔥
          </button>
        ):(
          <div>
            <div style={{fontSize:16,color:'#c0c0c0',lineHeight:1.65,fontFamily:"'Space Grotesk',sans-serif",marginTop:12,marginBottom:24,fontStyle:'italic'}}>
              "{roast}"
            </div>
            <button onClick={onClose} style={{width:'100%',padding:'11px',borderRadius:10,background:'rgba(255,255,255,0.05)',color:'#444',border:'1px solid rgba(255,255,255,0.08)',fontSize:12,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,cursor:'pointer'}}>
              I deserve that
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MY SETUP CARD ────────────────────────────────────────────────────────────
const SETUP_TAGS=['🎯 Scalper','🌙 Night Owl','💎 Diamond Hands','⚡ Degen','📊 ICT/SMC','🐻 Bear','🐂 Bull','🌊 Swing','🔮 Macro','🤖 Algo','💀 Rekt Once','🏔 HODL'];
function SetupCardModal({th,fam,glow,onClose}){
  const[tags,setTags]=useState([]);
  const[done,setDone]=useState(false);
  const canvasRef=useRef(null);
  const toggleTag=(t)=>setTags(prev=>prev.includes(t)?prev.filter(x=>x!==t):[...prev.slice(-2),t]);
  const generate=()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext('2d');
    const W=1200,H=630;canvas.width=W;canvas.height=H;
    const bg=ctx.createLinearGradient(0,0,W,H);
    bg.addColorStop(0,th.bg);bg.addColorStop(1,th.sf||th.bg);
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    // Noise dots
    for(let i=0;i<600;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.03})`;ctx.beginPath();ctx.arc(Math.random()*W,Math.random()*H,Math.random()*1.5,0,Math.PI*2);ctx.fill();}
    // Accent glow
    const gr=ctx.createRadialGradient(W*0.8,H*0.2,0,W*0.8,H*0.2,400);
    gr.addColorStop(0,th.ac+'18');gr.addColorStop(1,'transparent');
    ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
    // Left panel
    ctx.fillStyle='rgba(0,0,0,0.22)';
    rr(ctx,40,40,340,550,16);ctx.fill();
    // Title
    ctx.fillStyle=th.ac;ctx.font='bold 14px monospace';ctx.fillText('MY TRADING SETUP',70,90);
    ctx.fillStyle=th.tx==='#141414'||th.tx==='#101010'?'#f0f0f0':th.tx;
    ctx.font='bold 68px serif';ctx.fillText('Chart',70,180);ctx.fillText('Colors',70,258);
    ctx.fillStyle='rgba(255,255,255,0.25)';ctx.font='13px monospace';
    ctx.fillText(th.tag.toUpperCase(),70,295);
    // Color bars
    [[fam.opens,'OPENS'],[fam.highs,'HIGHS'],[fam.lows,'LOWS'],[fam.mids,'MIDS'],[th.up,'UP CANDLE'],[th.dn,'DN CANDLE']].forEach(([col,lbl],i)=>{
      const y=330+i*38;ctx.fillStyle=col;rr(ctx,70,y,160,26,5);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.45)';ctx.font='11px monospace';ctx.fillText(lbl,244,y+17);
    });
    // Tags
    if(tags.length>0){
      ctx.fillStyle='rgba(255,255,255,0.1)';ctx.font='bold 11px monospace';ctx.fillText('TRADER TYPE',70,570);
      tags.forEach((tag,i)=>{ctx.fillStyle=th.ac+'33';rr(ctx,70+i*180,540,165,28,8);ctx.fill();ctx.fillStyle=th.ac;ctx.font='12px monospace';ctx.fillText(tag,82,558+i*0);});
    }
    // Candles
    [[th.up,500],[th.dn,610]].forEach(([fill,x])=>{
      ctx.strokeStyle=th.wk;ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(x+40,100);ctx.lineTo(x+40,150);ctx.stroke();
      ctx.fillStyle=fill;rr(ctx,x,150,80,170,7);ctx.fill();
      ctx.strokeStyle=th.wk;ctx.lineWidth=2;rr(ctx,x,150,80,170,7);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x+40,320);ctx.lineTo(x+40,370);ctx.stroke();
    });
    // Swatches
    [th.bg,th.sf,th.ac,th.up,th.dn,th.wk].forEach((hex,i)=>{
      const sx=500+(i%3)*120,sy=420+Math.floor(i/3)*70;
      ctx.fillStyle=hex;rr(ctx,sx,sy,100,54,8);ctx.fill();
    });
    // Watermark
    ctx.fillStyle='rgba(255,255,255,0.12)';ctx.font='bold 16px monospace';
    ctx.fillText('trading-color-kit.vercel.app',40,H-20);
    ctx.fillStyle='rgba(255,255,255,0.08)';ctx.font='14px monospace';
    ctx.fillText('by aSian · @_a_Sian_',W-220,H-20);
    setDone(true);
  };
  function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();}
  const download=()=>{const a=document.createElement('a');a.href=canvasRef.current.toDataURL('image/png');a.download=`${th.id}-setup.png`;a.click();};
  return(
    <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,0.88)',display:'flex',alignItems:'center',justifyContent:'center',padding:24,backdropFilter:'blur(12px)'}} onClick={onClose}>
      <div style={{background:'#0a0a14',borderRadius:24,padding:28,border:'1px solid rgba(255,255,255,0.08)',maxWidth:680,width:'100%',maxHeight:'88vh',overflowY:'auto',animation:'kitIn 0.3s ease'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
          <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:'#333',letterSpacing:'0.2em'}}>MY SETUP CARD · {th.name}</div>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#333',fontSize:18,cursor:'pointer'}}>✕</button>
        </div>
        {/* Tag picker */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'#222',letterSpacing:'0.15em',marginBottom:8}}>PICK UP TO 3 TAGS</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {SETUP_TAGS.map(t=>{const sel=tags.includes(t);return(<button key={t} onClick={()=>toggleTag(t)} style={{padding:'5px 11px',borderRadius:20,background:sel?th.ac+'22':'rgba(255,255,255,0.03)',color:sel?th.ac:'#444',border:`1px solid ${sel?th.ac+'44':'rgba(255,255,255,0.07)'}`,fontSize:11,fontFamily:"'Space Grotesk',sans-serif",cursor:'pointer',transition:'all 0.15s',fontWeight:sel?'600':'400'}}>{t}</button>);})}
          </div>
        </div>
        <button onClick={generate} className="btn-accent" style={{width:'100%',padding:'12px',borderRadius:12,background:th.ac,color:'#000',border:'none',fontSize:13,fontWeight:700,marginBottom:16,letterSpacing:'0.05em'}}>
          ⚡ Generate Card
        </button>
        {done&&(
          <>
            <canvas ref={canvasRef} style={{width:'100%',borderRadius:12,border:'1px solid rgba(255,255,255,0.06)',marginBottom:12}}/>
            <button onClick={download} className="btn-primary" style={{width:'100%',padding:'11px',borderRadius:10,color:'#e0e0e0',fontSize:12,fontWeight:600,border:'1px solid rgba(255,255,255,0.1)',letterSpacing:'0.05em'}}>
              ↓ Download (Twitter / Telegram ready)
            </button>
          </>
        )}
        {!done&&<canvas ref={canvasRef} style={{display:'none'}}/>}
      </div>
    </div>
  );
}


// ─── PARTICLE SYSTEM (outside React) ──────────────────────────────────────────
(()=>{
  const canvas=document.createElement('canvas');
  canvas.id='particle-canvas';
  document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  let particles=[];
  const resize=()=>{canvas.width=innerWidth;canvas.height=innerHeight;};
  resize();window.addEventListener('resize',resize);

  // Copy burst particles
  window.__particleBurst=(x,y,color)=>{
    const hex=color||'#c8a830';
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    for(let i=0;i<8;i++){
      const angle=(i/8)*Math.PI*2;
      const speed=2+Math.random()*3;
      particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-2,r,g,b,life:1,size:3+Math.random()*3});
    }
  };

  // Ambient hero particles
  const ambient=Array.from({length:24},()=>({
    x:Math.random()*innerWidth*0.6,y:Math.random()*innerHeight*0.7,
    vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.2,
    r:200,g:168,b:48,life:Math.random(),maxLife:1,size:1.5+Math.random()*1.5,
    ambient:true,
  }));

  let raf;
  const draw=()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // Ambient particles
    const ac=window.__kitAccent||'#c8a830';
    const ar=parseInt(ac.slice(1,3)||'c8',16),ag=parseInt(ac.slice(3,5)||'a8',16),ab=parseInt(ac.slice(5,7)||'30',16);
    ambient.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.life+=0.004;
      if(p.x<0||p.x>innerWidth*0.65)p.vx*=-1;
      if(p.y<0||p.y>innerHeight*0.75)p.vy*=-1;
      const o=Math.sin(p.life*Math.PI)*0.18;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle=`rgba(${ar},${ag},${ab},${o})`;ctx.fill();
    });
    // Burst particles
    particles=particles.filter(p=>p.life>0);
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.vy+=0.12;p.life-=0.04;p.vx*=0.94;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);
      ctx.fillStyle=`rgba(${p.r},${p.g},${p.b},${p.life*0.9})`;ctx.fill();
    });
    raf=requestAnimationFrame(draw);
  };
  draw();
})();

// ─── COLOR DNA (deterministic SVG fingerprint) ─────────────────────────────────
function ColorDNA({th,size=28}){
  const seed=th.id.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  const rnd=(s)=>{let x=Math.sin(s+seed)*10000;return x-Math.floor(x);};
  const cols=[th.up,th.dn,th.ac,th.wk];
  const shapes=Array.from({length:6},(_,i)=>({
    x:rnd(i*7)*size, y:rnd(i*11)*size,
    r:2+rnd(i*13)*4,
    col:cols[i%cols.length],
    op:0.4+rnd(i*17)*0.6,
  }));
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{borderRadius:6,flexShrink:0}}>
      {shapes.map((s,i)=>(
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.col} opacity={s.op}/>
      ))}
    </svg>
  );
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function AnimCounter({to,duration=600}){
  const[val,setVal]=useState(0);
  useEffect(()=>{
    let start=null;
    const step=(ts)=>{
      if(!start)start=ts;
      const p=Math.min((ts-start)/duration,1);
      setVal(parseFloat((to*p).toFixed(1)));
      if(p<1)requestAnimationFrame(step);else setVal(to);
    };
    requestAnimationFrame(step);
  },[to]);
  return <span>{val}</span>;
}

// ─── COLOR EXPORT GRID ─────────────────────────────────────────────────────────
function ColorExportModal({th,fam,onClose}){
  const canvasRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const W=800,H=500,pad=32,gap=16;
    canvas.width=W;canvas.height=H;
    const ctx=canvas.getContext('2d');
    // BG
    ctx.fillStyle=th.bg;ctx.fillRect(0,0,W,H);
    // Noise dots
    for(let i=0;i<300;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.025})`;ctx.beginPath();ctx.arc(Math.random()*W,Math.random()*H,Math.random()*1.2,0,Math.PI*2);ctx.fill();}
    // Title
    ctx.fillStyle='rgba(255,255,255,0.15)';ctx.font='bold 11px monospace';
    ctx.fillText(th.name.toUpperCase()+' · '+th.tag.toUpperCase(),pad,28);
    ctx.fillStyle='rgba(255,255,255,0.08)';ctx.font='10px monospace';
    ctx.fillText('tvkits.xyz',W-110,H-14);

    const colors=[
      {hex:th.bg,label:'BACKGROUND'},{hex:th.up,label:'UP CANDLE'},
      {hex:th.dn,label:'DOWN CANDLE'},{hex:th.wk,label:'WICK'},
      {hex:th.tx,label:'TEXT'},{hex:th.gr,label:'GRID'},
      {hex:fam.opens,label:'OPENS'},{hex:fam.highs,label:'HIGHS'},
      {hex:fam.lows,label:'LOWS'},{hex:fam.mids,label:'MIDS'},
    ];
    const cols=5,rows=2,cw=(W-pad*2-gap*(cols-1))/cols,ch=(H-80-gap*(rows-1))/rows;
    colors.forEach((c,i)=>{
      const cx=pad+(i%cols)*(cw+gap),cy=48+Math.floor(i/cols)*(ch+gap);
      // Card
      ctx.fillStyle='rgba(0,0,0,0.2)';
      rRect(ctx,cx,cy,cw,ch,10);ctx.fill();
      // Color swatch
      ctx.fillStyle=c.hex;
      rRect(ctx,cx+8,cy+8,cw-16,ch-44,7);ctx.fill();
      // Label
      ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='bold 9px monospace';
      ctx.fillText(c.label,cx+8,cy+ch-22);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px monospace';
      ctx.fillText(c.hex.slice(0,7).toUpperCase(),cx+8,cy+ch-10);
    });
    function rRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();}
  },[]);
  const dl=()=>{const a=document.createElement('a');a.href=canvasRef.current.toDataURL('image/png');a.download=th.id+'-colors.png';a.click();};
  return(
    <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,0.88)',display:'flex',alignItems:'center',justifyContent:'center',padding:24,backdropFilter:'blur(12px)'}} onClick={onClose}>
      <div style={{background:'#0a0a14',borderRadius:20,padding:24,border:'1px solid rgba(255,255,255,0.08)',maxWidth:600,width:'100%',animation:'kitIn 0.3s ease'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
          <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'#333',letterSpacing:'0.2em'}}>COLOR GRID · {th.name}</span>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#333',fontSize:18,cursor:'pointer'}}>✕</button>
        </div>
        <canvas ref={canvasRef} style={{width:'100%',borderRadius:10,border:'1px solid rgba(255,255,255,0.06)',marginBottom:12,display:'block'}}/>
        <button onClick={dl} className="btn-accent" style={{width:'100%',padding:'11px',borderRadius:10,background:th.ac,color:'#000',border:'none',fontSize:12,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,cursor:'pointer'}}>↓ Download Color Grid</button>
      </div>
    </div>
  );
}


// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({msg}){
  return msg?(<div style={{position:"fixed",bottom:32,left:"50%",transform:"translateX(-50%)",zIndex:500,padding:"12px 24px",borderRadius:24,background:"rgba(20,20,28,0.95)",border:"1px solid rgba(255,255,255,0.1)",color:"#90e890",fontSize:13,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.1em",animation:"toastIn 0.3s ease",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>{msg}</div>):null;
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const[siteMode,setSiteMode]=useState(()=>{try{const s=localStorage.getItem('tck-site-mode');if(s)return s;}catch{}return window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';});
    const[activeTheme,setTheme]=useState(()=>new URLSearchParams(location.search).get('kit')||localStorage.getItem('tck-last-kit')||"ember");
  const[palette,setPal]=useState(()=>new URLSearchParams(location.search).get('pal')||"match");
  const[activeTab,setTab]=useState("kl");
  const[filter,setFilter]=useState("ALL");
  const[search,setSearch]=useState("");
  const[searchHistory,setSearchHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem('tck-search-hist')||'[]');}catch{return [];}});
  const[showSearchHist,setShowSearchHist]=useState(false);
  const addToHistory=(q)=>{if(!q.trim())return;setSearchHistory(prev=>{const n=[q,...prev.filter(x=>x!==q)].slice(0,5);try{localStorage.setItem('tck-search-hist',JSON.stringify(n));}catch{}return n;});};
  const[favs,setFavs]=useState(()=>{try{return JSON.parse(localStorage.getItem('tck-favs')||'[]')}catch{return[]}});
  const[ratings,setRatings]=useState(()=>{try{return JSON.parse(localStorage.getItem('tck-ratings')||'{}')}catch{return{}}});
  const[recent,setRecent]=useState(()=>{try{return JSON.parse(localStorage.getItem('tck-recent')||'[]')}catch{return[]}});
  const[showCard,setShowCard]=useState(false);
  const[showChart,setShowChart]=useState(false);
  const[showFullChart,setShowFullChart]=useState(false);
  const[chartMode,setChartMode]=useState(null);
  const[showChangelog,setShowChangelog]=useState(false);
  const[showScreensaver,setShowScreensaver]=useState(false);
  const[sessionViews,setSessionViews]=useState(()=>{try{return JSON.parse(sessionStorage.getItem('tck-views')||'{}')}catch{return{}}});
  const idleRef=useRef(null);
  const[scrollY,setScrollY]=useState(0);
  const[gridCollapsed,setGridCollapsed]=useState(()=>{try{return window.matchMedia('(max-width:900px)').matches;}catch{return false;}});
  // Auto-expand grid on desktop
  useEffect(()=>{
    const check=()=>{if(window.innerWidth>900)setGridCollapsed(false);};
    check();window.addEventListener('resize',check);return()=>window.removeEventListener('resize',check);
  },[]);

  useEffect(()=>{
    const h=()=>setScrollY(window.scrollY);
    window.addEventListener('scroll',h,{passive:true});
    return()=>window.removeEventListener('scroll',h);
  },[]);
  const[showCmd,setShowCmd]=useState(false);
  const[showRoast,setShowRoast]=useState(false);
  const[showExport,setShowExport]=useState(false);
  const[showSetup,setShowSetup]=useState(false);
  const[candleStyle,setCandleStyle]=useState('candles');
  const[timeframe,setTimeframe]=useState('H1');
  const[showCompare,setShowCompare]=useState(false);
  const[compareId,setCompareId]=useState(null);
  const[showKB,setShowKB]=useState(false);
  const[compareMode,setCompareMode]=useState(false);
  const touchStartX=useRef(null);
  const[tooltip,setTooltip]=useState(null); // {t, x, y}
  const tooltipTimer=useRef(null);
  const showTooltip=(t,e)=>{
    clearTimeout(tooltipTimer.current);
    tooltipTimer.current=setTimeout(()=>{
      const rect=e.currentTarget.getBoundingClientRect();
      setTooltip({t,x:rect.left+rect.width/2,y:rect.bottom+8});
    },500);
  };
  const hideTooltip=()=>{clearTimeout(tooltipTimer.current);setTooltip(null);};
  const handleTouchStart=(e)=>{touchStartX.current=e.touches[0].clientX;};
  const handleTouchEnd=(e)=>{
    if(touchStartX.current===null)return;
    const dx=e.changedTouches[0].clientX-touchStartX.current;
    if(Math.abs(dx)>60){
      const card=document.querySelector('.kit-slide');
      if(card){
        card.classList.add(dx<0?'swipe-left-anim':'swipe-right-anim');
        setTimeout(()=>card.classList.remove('swipe-left-anim','swipe-right-anim'),400);
      }
      if(dx<0)nextKit();else prevKit();
    }
    touchStartX.current=null;
  };
  const[toast,setToast]=useState("");
  const[showFavs,setShowFavs]=useState(false);
  const kotd=getKOTD();
  const season=getSeason();
  const seasonal=SEASONAL[season];

  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(""),2200);};

  // Recently viewed tracker
  useEffect(()=>{
    setRecent(prev=>{
      const next=[activeTheme,...prev.filter(id=>id!==activeTheme)].slice(0,6);
      try{localStorage.setItem('tck-recent',JSON.stringify(next));}catch{}
      return next;
    });
  },[activeTheme]);

  // Community ratings
  const rateKit=(id,vote)=>{
    setRatings(prev=>{
      const curr=prev[id]||{up:0,down:0,myVote:null};
      let next={...curr};
      if(curr.myVote===vote){next[vote]--;next.myVote=null;}
      else{if(curr.myVote)next[curr.myVote]--;next[vote]++;next.myVote=vote;}
      const updated={...prev,[id]:next};
      try{localStorage.setItem('tck-ratings',JSON.stringify(updated));}catch{}
      return updated;
    });
    showToast(vote==='up'?'👍 Rated!':'👎 Rated');
  };

  // Keyboard shortcuts
  const nextKit=()=>{const idx=THEMES.findIndex(t=>t.id===activeTheme);setTheme(THEMES[(idx+1)%THEMES.length].id);};
  const prevKit=()=>{const idx=THEMES.findIndex(t=>t.id===activeTheme);setTheme(THEMES[(idx-1+THEMES.length)%THEMES.length].id);};
  useEffect(()=>{
    const h=(e)=>{
      if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();setShowCmd(v=>!v);return;}
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
      if(e.key==='r'||e.key==='R')randomKit();
      else if(e.key==='f'||e.key==='F')toggleFav(activeTheme);
      else if(e.key==='ArrowRight')nextKit();
      else if(e.key==='ArrowLeft')prevKit();
      else if(e.key==='c'||e.key==='C'){setCompareMode(v=>!v);showToast('Compare mode: click a second kit');}
      else if(e.key==='Escape'){setShowCompare(false);setShowKB(false);setSearch('');setShowScreensaver(false);setShowCmd(false);setShowRoast(false);setShowSetup(false);}
      else if(e.key==='?')setShowKB(true);
      else if(['1','2','3','4','5','6'].includes(e.key))setTab(SECS[parseInt(e.key)-1]?.key||'kl');
    };
    window.addEventListener('keydown',h);
    return()=>window.removeEventListener('keydown',h);
  },[activeTheme,favs]);

  // Idle detection — show screensaver after 60s
  useEffect(()=>{
    const reset=()=>{
      clearTimeout(idleRef.current);
      if(showScreensaver)return;
      idleRef.current=setTimeout(()=>setShowScreensaver(true),60000);
    };
    const events=['mousemove','mousedown','keydown','touchstart','scroll'];
    events.forEach(e=>window.addEventListener(e,reset,{passive:true}));
    reset();
    return()=>{clearTimeout(idleRef.current);events.forEach(e=>window.removeEventListener(e,reset));};
  },[showScreensaver]);

  // Sync URL for shareability
  // Idle detection — show screensaver after 60s
  useEffect(()=>{
    const reset=()=>{
      clearTimeout(idleRef.current);
      if(showScreensaver)return;
      idleRef.current=setTimeout(()=>setShowScreensaver(true),60000);
    };
    const events=['mousemove','mousedown','keydown','touchstart','scroll'];
    events.forEach(e=>window.addEventListener(e,reset,{passive:true}));
    reset();
    return()=>{clearTimeout(idleRef.current);events.forEach(e=>window.removeEventListener(e,reset));};
  },[showScreensaver]);

  // Persist last viewed kit + session view tracking
  useEffect(()=>{
    try{localStorage.setItem('tck-last-kit',activeTheme);}catch{}
    setSessionViews(prev=>{
      const next={...prev,[activeTheme]:(prev[activeTheme]||0)+1};
      try{sessionStorage.setItem('tck-views',JSON.stringify(next));}catch{}
      return next;
    });
  },[activeTheme]);

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
    const msg='Check out the '+th.name+' kit on tvkits.xyz — '+th.tag+' '+location.href;
    navigator.clipboard?.writeText(msg);
    showToast('🔗 Share text copied!');
  };

  const copyAll=()=>{
    const T2=tools(fam.opens,fam.highs,fam.lows,fam.mids,th.ac);
    const k=T2.kl; const ic=T2.ict; const v=T2.vwap; const p=T2.pivots;
    const z=T2.zones; const m=T2.mas; const vp=T2.volProfile; const ind=T2.indicators;
    const lines=[
      `=== ${th.name} · ${palette.toUpperCase()} ===`,
      ``,
      `-- CHART COLORS --`,
      `Background:     ${th.bg}`,
      `Surface:        ${th.sf}`,
      `Up Candle:      ${th.up}`,
      `Down Candle:    ${th.dn}`,
      `Wick / Border:  ${th.wk}`,
      `Text / Labels:  ${th.tx}`,
      `Accent:         ${th.ac}`,
      `Grid Lines:     ${th.gr}`,
      ``,
      `-- COLOR FAMILIES --`,
      `Opens (gold):   ${fam.opens}`,
      `Highs (red):    ${fam.highs}`,
      `Lows (green):   ${fam.lows}`,
      `Mids (purple):  ${fam.mids}`,
      ``,
      `-- KEY LEVELS --`,
      `Daily Open:     ${k.dOpen}`,
      `Weekly Open:    ${k.wOpen}`,
      `Monthly Open:   ${k.mOpen}`,
      `Yearly Open:    ${k.yOpen}`,
      `RTH Open:       ${k.rthOpen}`,
      `Prev Day Close: ${k.pdc}`,
      `Prev Day High:  ${k.pdh}`,
      `Prev Week High: ${k.pwh}`,
      `Prev Month Hi:  ${k.pmh}`,
      `Monday High:    ${k.monHigh}`,
      `RTH High:       ${k.rthHigh}`,
      `Overnight High: ${k.onHigh}`,
      `Prev Day Low:   ${k.pdl}`,
      `Prev Week Low:  ${k.pwl}`,
      `Prev Month Lo:  ${k.pml}`,
      `Monday Low:     ${k.monLow}`,
      `RTH Low:        ${k.rthLow}`,
      `Overnight Low:  ${k.onLow}`,
      `Daily S/R Hi:   ${k.srDayH}`,
      `Daily S/R Lo:   ${k.srDayL}`,
      `Weekly S/R Hi:  ${k.srWkH}`,
      `Weekly S/R Lo:  ${k.srWkL}`,
      `Monthly S/R Hi: ${k.srMoH}`,
      `Monthly S/R Lo: ${k.srMoL}`,
      `Daily nPOC:     ${k.dNPOC}`,
      `Weekly nPOC:    ${k.wNPOC}`,
      `Monthly nPOC:   ${k.mNPOC}`,
      `Monday Mid:     ${k.monMid}`,
      `RTH Midpoint:   ${k.rthMid}`,
      `Overnight Mid:  ${k.onMid}`,
      `Weekly Mid:     ${k.wkMid}`,
      `Monthly Mid:    ${k.moMid}`,
      `RTH Fill:       ${k.rthFill}`,
      `Overnight Fill: ${k.onFill}`,
      `London KZ Fill: ${k.lonFill}`,
      `NY KZ Fill:     ${k.nyFill}`,
      ``,
      `-- ICT / SMC --`,
      `BOS:            ${ic.bos}`,
      `ChoCH:          ${ic.choch}`,
      `MSS:            ${ic.mss}`,
      `Liq Sweep:      ${ic.liqSweep}`,
      `Breaker Block:  ${ic.breaker}`,
      `Rejection Block:${ic.rejection}`,
      `Mitigation Blk: ${ic.mitigation}`,
      `IFVG:           ${ic.ifvg}`,
      `OTE:            ${ic.ote}`,
      `Silver Bullet:  ${ic.silverBullet}`,
      `PO3 Bull:       ${ic.po3Bull}`,
      `PO3 Bear:       ${ic.po3Bear}`,
      `London KZ:      ${ic.kzLon}`,
      `NY KZ:          ${ic.kzNY}`,
      `Asia KZ:        ${ic.kzAsia}`,
      `Sydney KZ:      ${ic.kzSyd}`,
      ``,
      `-- VWAP --`,
      `VWAP:           ${v.vwap}`,
      `aVWAP Anchor:   ${v.anchor}`,
      `+1σ Band:       ${v.band1pos}`,
      `+2σ Band:       ${v.band2pos}`,
      `+3σ Band:       ${v.band3pos}`,
      `-1σ Band:       ${v.band1neg}`,
      `-2σ Band:       ${v.band2neg}`,
      `-3σ Band:       ${v.band3neg}`,
      ``,
      `-- PIVOTS --`,
      `R3: ${p.r3}  R2: ${p.r2}  R1: ${p.r1}`,
      `PP: ${p.pp}`,
      `S1: ${p.s1}  S2: ${p.s2}  S3: ${p.s3}`,
      `Weekly Pivots:  ${p.weekly}`,
      `Monthly Pivots: ${p.monthly}`,
      ``,
      `-- ZONES --`,
      `Resistance:     ${z.resistance}`,
      `Bearish Box:    ${z.bear}`,
      `Premium Array:  ${z.premium}`,
      `Support:        ${z.support}`,
      `Bullish Box:    ${z.bull}`,
      `Discount Array: ${z.discount}`,
      `FVG:            ${z.fvg}`,
      `Order Block:    ${z.orderBlock}`,
      `Equilibrium:    ${z.equilibrium}`,
      ``,
      `-- MOVING AVERAGES --`,
      `9 EMA:          ${m.ma1}`,
      `21 EMA:         ${m.ma2}`,
      `50 SMA:         ${m.ma3}`,
      `100 SMA:        ${m.ma4}`,
      `200 SMA:        ${m.ma5}`,
      ``,
      `-- VOLUME PROFILE --`,
      `POC:            ${vp.poc}`,
      `VAH:            ${vp.vah}`,
      `VAL:            ${vp.val}`,
      `Value Area Fill:${vp.valueArea}`,
      `HVN:            ${vp.hvn}`,
      `LVN:            ${vp.lvn}`,
      ``,
      `-- INDICATORS --`,
      `RSI:            ${ind.rsi}`,
      `MACD Line:      ${ind.macd}`,
      `MACD Signal:    ${ind.macdSig}`,
      `Histogram Bull: ${ind.histBull}`,
      `Histogram Bear: ${ind.histBear}`,
      `BB Upper:       ${ind.bbUp}`,
      `BB Lower:       ${ind.bbDn}`,
      `BB Fill:        ${ind.bbFill}`,
    ];
    navigator.clipboard?.writeText(lines.join('\n'));
    showToast('📋 All colors copied — ' + (lines.length-1) + ' values!');
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
  const TRENDING=["bitcoin","sol","pepe","matrix","fire","eth","hacker","casino","burgundy","radioactive"];

  // Glass tilt effect — single global listener sets CSS vars
  useEffect(()=>{
    const h=(e)=>{
      const el=e.target?.closest?.('.kit-card-tilt');
      if(!el)return;
      const r=el.getBoundingClientRect();
      el.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
      el.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
    };
    window.addEventListener('mousemove',h,{passive:true});
    return()=>window.removeEventListener('mousemove',h);
  },[]);

  // Update cursor glow + mesh + CSS vars for active kit
  useEffect(()=>{
    window.__kitAccent=th.ac;
    // Update CSS variables for gradient text and mesh
    document.documentElement.style.setProperty('--kit-ac', th.ac);
    document.documentElement.style.setProperty('--kit-ac2', th.up);
    document.documentElement.style.setProperty('--mesh-color-1', th.ac);
    document.documentElement.style.setProperty('--mesh-color-2', th.dn);
  },[th.ac, th.up, th.dn]);

  const dm=siteMode==='dark';
  const site={
    bg:dm?'#05050f':'#f2f0ea',
    navBg:dm?'rgba(5,5,15,0.94)':'rgba(242,240,234,0.94)',
    gridLine:dm?'rgba(255,255,255,0.018)':'rgba(0,0,0,0.04)',
    panelBg:dm?'#070710':'#e8e4dc',
    panelBorder:dm?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.08)',
    text:dm?'#fff':'#1a1814',
    subText:dm?'#c8c0b8':'#3a3830',
    muted:dm?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.04)',
    mutedBorder:dm?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.1)',
  };
  const glassStyle={background:site.muted,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${site.panelBorder}`};

  return(
    <div style={{minHeight:"100vh",background:site.bg,position:"relative",transition:"background 0.3s"}}>
      <Stars accentColor={th.ac}/>
      <div id="mesh-bg"/>

      {/* ── TICKER STRIP ── */}
      <div style={{position:"relative",zIndex:1,borderBottom:"1px solid rgba(255,255,255,0.05)",background:"rgba(0,0,0,0.3)",padding:"8px 0",overflow:"hidden"}}>
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...THEMES,...THEMES].map((t,i)=>(
              <div key={i} onClick={()=>setTheme(t.id)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"0 20px",cursor:"pointer",opacity:th.id===t.id?1:0.35,transition:"opacity 0.2s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.8"} onMouseLeave={e=>e.currentTarget.style.opacity=th.id===t.id?"1":"0.35"}>
                <div style={{width:8,height:8,borderRadius:2,background:t.up,flexShrink:0}}/>
                <div style={{width:8,height:8,borderRadius:2,background:t.dn,flexShrink:0}}/>
                <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#888",letterSpacing:"0.12em",whiteSpace:"nowrap"}}>{t.name}</span>
                <span style={{fontSize:8,color:"#2a2a2a",fontFamily:"'JetBrains Mono',monospace",marginLeft:2}}>{CAT_META[t.cat]?.label||""}</span>
                <span style={{color:"#1a1a1a",margin:"0 8px",fontSize:8}}>·</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <KitAura th={th}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)",backgroundSize:"80px 80px",pointerEvents:"none",zIndex:0}}/>

      <div style={{position:"relative",zIndex:1}}>

        {/* NAV */}
        <nav className="glass-shimmer" style={{position:"sticky",top:0,zIndex:100,...glassStyle,borderRadius:0,borderLeft:"none",borderRight:"none",borderTop:"none"}}>
          <div className="nav-inner" style={{padding:"0 52px",display:"flex",alignItems:"center",height:64,gap:16,maxWidth:1500,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:9,background:`linear-gradient(135deg,${th.ac},${th.ac}66)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:`0 0 24px ${th.ac}50`,transition:"all 0.4s",flexShrink:0}}>◈</div>
              <div className="hide-mobile">
                <div style={{fontSize:15,fontWeight:800,letterSpacing:"-0.02em",fontFamily:"'Space Grotesk',sans-serif",lineHeight:1}}>Trading Color Kits</div>
                <div style={{fontSize:9,color:"#282828",letterSpacing:"0.22em",fontFamily:"'JetBrains Mono',monospace",marginTop:1}}>BY aSian · 115 KITS</div>
              </div>
            </div>
            {/* Search */}
            <div style={{flex:1,maxWidth:280,position:"relative",zIndex:201}}>
              <input value={search} onChange={e=>setSearch(e.target.value)}
              onFocus={()=>setShowSearchHist(true)}
              onBlur={()=>setTimeout(()=>setShowSearchHist(false),200)}
              onKeyDown={e=>{if(e.key==='Enter'&&search.trim()){addToHistory(search.trim());}}}
              placeholder="Search kits..."
              style={{width:"100%",padding:"8px 14px 8px 36px",borderRadius:20,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"#888",fontSize:12,fontFamily:"'JetBrains Mono',monospace",outline:"none",letterSpacing:"0.04em"}}/>
            {showSearchHist&&searchHistory.length>0&&!search&&(
              <div style={{position:"absolute",top:"100%",left:0,right:0,marginTop:4,background:"rgba(10,10,20,0.97)",borderRadius:12,border:"1px solid rgba(255,255,255,0.08)",overflow:"hidden",zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
                <div style={{padding:"6px 10px",fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#2a2a2a",letterSpacing:"0.15em",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>RECENT SEARCHES</div>
                {searchHistory.map(h=>(
                  <div key={h} onClick={()=>{setSearch(h);setShowSearchHist(false);}} style={{padding:"9px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"background 0.1s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{fontSize:11,color:"#3a3a3a"}}>⏱</span>
                    <span style={{fontSize:12,fontFamily:"'Space Grotesk',sans-serif",color:"#555"}}>{h}</span>
                    <span onClick={e=>{e.stopPropagation();setSearchHistory(prev=>{const n=prev.filter(x=>x!==h);try{localStorage.setItem('tck-search-hist',JSON.stringify(n));}catch{}return n;});}} style={{marginLeft:"auto",color:"#2a2a2a",fontSize:12,cursor:"pointer",padding:"0 4px"}}>✕</span>
                  </div>
                ))}
              </div>
            )}
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#333",fontSize:12}}>⌕</span>
            </div>
            <div style={{flex:1}}/>
            {/* Actions */}
            <button onClick={()=>setShowChangelog(true)} style={{padding:"7px 12px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,color:"#333",fontSize:10,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",letterSpacing:"0.08em"}} className="hide-mobile">✦ WHAT'S NEW</button>
            <button onClick={()=>setShowCmd(true)} style={{padding:"7px 12px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,color:"#333",fontSize:10,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",letterSpacing:"0.08em",display:"flex",alignItems:"center",gap:6}} className="hide-mobile">
              <span>⌕</span><span>Search</span><kbd style={{padding:"1px 5px",borderRadius:4,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",fontSize:9,color:"#2a2a2a",fontFamily:"'JetBrains Mono',monospace"}}>⌘K</kbd>
            </button>
            <button onClick={randomKit} title="Random kit" style={{padding:"7px 14px",...glassStyle,borderRadius:20,color:"#555",fontSize:11,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",border:"1px solid rgba(255,255,255,0.07)",letterSpacing:"0.08em"}} className="hide-mobile">🎲 RANDOM</button>
            <div style={{display:"flex",gap:4,padding:3,borderRadius:24,...glassStyle}}>
              {["match","vivid"].map(p=>{const a=palette===p;return(
                <button key={p} onClick={()=>setPal(p)} style={{padding:"6px 16px",borderRadius:20,background:a?th.ac:"transparent",color:a?"#000":"#444",border:"none",fontSize:11,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",transition:"all 0.2s",fontWeight:a?"700":"400",boxShadow:a&&glow?`0 0 18px ${th.ac}70`:"none"}}>
                  {PAL[p].icon} {PAL[p].label}
                </button>
              );})}
            </div>
            <button onClick={()=>setSiteMode(m=>{const n=m==='dark'?'light':'dark';try{localStorage.setItem('tck-site-mode',n);}catch{}return n;})} style={{padding:"7px 14px",borderRadius:20,background:site.muted,border:`1px solid ${site.panelBorder}`,color:site.subText,fontSize:12,cursor:"pointer",transition:"all 0.2s",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.06em"}} title="Toggle light/dark mode">
              {siteMode==='dark'?'☀ LIGHT':'☾ DARK'}
            </button>
          </div>
        </nav>

        {/* HERO */}
        <div className="main-pad" style={{padding:"72px 52px 48px",maxWidth:1500,margin:"0 auto"}}>
          <div className="hero-grid" style={{display:"grid",gridTemplateColumns:"1fr",gap:60,alignItems:"center",marginBottom:64}}>
            <div className="fade-up">
              <div style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:th.ac,letterSpacing:"0.35em",marginBottom:18,textShadow:glow?`0 0 20px ${th.ac}`:"none"}}>✦ THE DEFINITIVE TRADINGVIEW COLOR REFERENCE</div>
              <h1 className="hero-h1" style={{fontSize:"clamp(48px,5.5vw,88px)",fontWeight:700,lineHeight:0.9,letterSpacing:"-0.04em",fontFamily:"'Space Grotesk',sans-serif",marginBottom:22}}>
                <span style={{color:"#f0ece6"}}>Chart</span><br/>
                <span className="gradient-text">Color</span><br/>
                <span style={{color:"#f0ece6"}}>Kits</span>
              </h1>
              <p style={{fontSize:15,color:"#3a3a3a",maxWidth:460,lineHeight:1.7,fontFamily:"'Space Grotesk',sans-serif",marginBottom:32}}>115 curated color systems for TradingView. Key Levels, ICT/SMC, Fibonacci, VWAP, nPOC and more. Click any color to copy.</p>
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
            {/* KOTD + Seasonal + Recent + KB */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
              {(()=>{const kt=THEMES.find(t=>t.id===kotd);if(!kt)return null;return(
                <button onClick={()=>setTheme(kotd)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",borderRadius:12,background:"rgba(255,215,0,0.06)",border:"1px solid rgba(255,215,0,0.18)",cursor:"pointer"}}>
                  <span style={{fontSize:13}}>🏆</span>
                  <div><div style={{fontSize:7,fontFamily:"'JetBrains Mono',monospace",color:"#665500",letterSpacing:"0.2em"}}>KIT OF THE DAY</div><div style={{fontSize:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,color:"#d4a800"}}>{kt.name}</div></div>
                </button>
              );})()}
              {(()=>{const st=THEMES.find(t=>t.id===seasonal.id);if(!st)return null;return(
                <button onClick={()=>setTheme(seasonal.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",borderRadius:12,background:`${seasonal.color}0c`,border:`1px solid ${seasonal.color}28`,cursor:"pointer"}}>
                  <span style={{fontSize:13}}>🌟</span>
                  <div><div style={{fontSize:7,fontFamily:"'JetBrains Mono',monospace",color:seasonal.color,letterSpacing:"0.18em",opacity:0.7}}>SEASONAL</div><div style={{fontSize:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,color:seasonal.color}}>{seasonal.label}</div></div>
                </button>
              );})()}
              <button onClick={()=>setShowKB(true)} style={{padding:"7px 12px",borderRadius:12,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",cursor:"pointer",color:"#252525",fontSize:9,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.1em"}}>⌨ ?</button>
            </div>
            {/* Currently popular this session */}
            {(()=>{const popular=Object.entries(sessionViews).filter(([id])=>id!==activeTheme).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([id])=>THEMES.find(t=>t.id===id)).filter(Boolean);return popular.length>0&&(
              <div style={{marginBottom:12}}>
                <div style={{fontSize:7,fontFamily:"'JetBrains Mono',monospace",color:"#1a1a1a",letterSpacing:"0.22em",marginBottom:6}}>🔥 HOT THIS SESSION</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {popular.map(t=>(
                    <button key={t.id} onClick={()=>setTheme(t.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 9px",borderRadius:16,background:"rgba(0,0,0,0.7)",border:`1px solid ${t.ac}60`,cursor:"pointer"}}>
                      <div style={{width:8,height:8,borderRadius:2,background:t.up,flexShrink:0}}/>
                      <span style={{fontSize:8,fontFamily:"'Space Grotesk',sans-serif",color:t.ac,fontWeight:700}}>{t.name}</span>
                      <span style={{fontSize:7,fontFamily:"'JetBrains Mono',monospace",color:t.ac,opacity:0.7}}>{sessionViews[t.id]}x</span>
                    </button>
                  ))}
                </div>
              </div>
            );})()}

            {recent.filter(id=>id!==activeTheme).slice(0,5).length>0&&(
              <div style={{marginBottom:12}}>
                <div style={{fontSize:7,fontFamily:"'JetBrains Mono',monospace",color:"#1a1a1a",letterSpacing:"0.22em",marginBottom:6}}>⏱ RECENTLY VIEWED</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {recent.filter(id=>id!==activeTheme).slice(0,5).map(id=>{const t=THEMES.find(x=>x.id===id);if(!t)return null;return(
                    <button key={id} onClick={()=>setTheme(id)} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 9px",borderRadius:16,background:SBGS[id]||t.bg,border:`1px solid ${t.ac}40`,cursor:"pointer"}}>
                      <div style={{width:8,height:8,borderRadius:2,background:t.up,flexShrink:0}}/>
                      <span style={{fontSize:8,fontFamily:"'Space Grotesk',sans-serif",color:t.ac,fontWeight:700}}>{t.name}</span>
                    </button>
                  );})}
                </div>
              </div>
            )}
            {compareMode&&<div style={{padding:"9px 12px",borderRadius:10,background:"rgba(255,200,0,0.06)",border:"1px solid rgba(255,200,0,0.18)",display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <span style={{fontSize:10}}>⚡</span>
              <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#886600",letterSpacing:"0.06em",flex:1}}>COMPARE MODE — click any kit</span>
              <button onClick={()=>setCompareMode(false)} style={{background:"none",border:"none",color:"#554400",cursor:"pointer",fontSize:14}}>✕</button>
            </div>}
          </div>

          {/* CATEGORY FILTER */}
          <div className="noscroll" style={{display:"flex",gap:7,marginBottom:20}}>
            {cats.map(c=>{const a=(filter===c.id||(c.id==="FAVS"&&showFavs));return(
              <button key={c.id} onClick={()=>{if(c.id==="FAVS"){setShowFavs(true);setFilter("FAVS");}else{setShowFavs(false);setFilter(c.id);}}} style={{flex:"0 0 auto",padding:"8px 18px",borderRadius:22,background:a?c.dot:"rgba(255,255,255,0.03)",color:a?"#000":c.dot,border:`1px solid ${a?c.dot:c.dot+"33"}`,fontSize:10,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",transition:"all 0.18s",fontWeight:a?"700":"400",letterSpacing:"0.1em",whiteSpace:"nowrap",boxShadow:a?`0 0 18px ${c.dot}40`:"none"}}>{c.label}</button>
            );})}
          </div>

          {/* Mobile collapse toggle */}
          {/* Mobile toggle — hidden on desktop via CSS */}
          <div className="show-mobile-only" style={{marginBottom:8}}>
            {/* When collapsed: show active kit + browse button */}
            {gridCollapsed&&(
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:14,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)"}}>
                <div style={{display:"flex",gap:3,flexShrink:0,alignItems:"flex-end"}}>
                  {[{fill:th.up,h:18},{fill:th.dn,h:13},{fill:th.up,h:22},{fill:th.up,h:15},{fill:th.dn,h:17}].map((cv,ci)=>(
                    <div key={ci} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                      <div style={{width:2,height:3,background:th.wk,borderRadius:1}}/>
                      <div style={{width:6,height:cv.h,borderRadius:2,background:cv.fill}}/>
                      <div style={{width:2,height:2,background:th.wk,borderRadius:1}}/>
                    </div>
                  ))}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:th.ac,fontFamily:"'Space Grotesk',sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{th.name}</div>
                  <div style={{fontSize:9,color:"#3a3a3a",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.1em"}}>{CAT_META[th.cat]?.label||"CLASSIC"}</div>
                </div>
                <button onClick={()=>setGridCollapsed(false)} style={{flexShrink:0,padding:"8px 14px",borderRadius:10,background:th.ac,color:"#000",border:"none",fontSize:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,cursor:"pointer",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>
                  BROWSE ↓
                </button>
              </div>
            )}
            {/* When expanded: show close button */}
            {!gridCollapsed&&(
              <button onClick={()=>setGridCollapsed(true)} style={{width:"100%",padding:"10px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",color:"#555",fontSize:11,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",letterSpacing:"0.1em"}}>
                ✕ CLOSE KITS
              </button>
            )}
          </div>

          {/* Kit grid — always visible on desktop, toggleable on mobile */}
          <div className="kit-grid" style={{display:gridCollapsed?"none":"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:9,marginBottom:14}} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            {displayed.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"48px 0",color:"#2a2a2a",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>No kits found. <button onClick={()=>{setSearch("");setFilter("ALL");setShowFavs(false);}} style={{color:th.ac,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:"inherit"}}>Clear filters</button></div>}
            {displayed.map((t,_i)=>{
              const tcm=CAT_META[t.cat]||{dot:"#888",label:""};
              const active=th.id===t.id;
              const tg=["NEON","VIBE","DEGEN","CYBER","FREAK","AURA","GUM","FREE","ANIME","MEME"].includes(t.cat);
              const bg=SBGS[t.id]||PHANTOM_SBGS[t.id]||t.bg;
              const isTrending=TRENDING.includes(t.id);
              return(
                <button key={t.id}
                  onClick={()=>{if(compareMode&&t.id!==activeTheme){setCompareId(t.id);setShowCompare(true);}else{setTheme(t.id);if(window.matchMedia('(max-width:900px)').matches){setGridCollapsed(true);setTimeout(()=>document.getElementById('kit-detail')?.scrollIntoView({behavior:'smooth',block:'start'}),50);}}}}
                  className={"kit-card kit-card-tilt kit-card-enter"+(active?" active":"")+(compareMode?" compare-hover":"")}
                  style={{'--card-glow':t.ac+'30','--mx':'50%','--my':'50%',padding:"16px 14px",borderRadius:14,background:bg,border:active?"1.5px solid "+t.ac+"aa":"1.5px solid rgba(255,255,255,0.05)",cursor:"pointer",textAlign:"left",backdropFilter:"blur(8px)",boxShadow:active?"0 14px 44px "+t.ac+"30,0 0 0 1px "+t.ac+"25":"0 2px 8px rgba(0,0,0,0.4)",position:"relative",animationDelay:_i*18+'ms'}}>
                  {t.id===kotd&&<div style={{position:"absolute",top:6,right:6,fontSize:8}} title="Kit of the Day">🏆</div>}
                  {t.id===seasonal.id&&<div style={{position:"absolute",top:t.id===kotd?18:6,right:6,fontSize:8}} title={seasonal.label}>🌟</div>}
                  {isTrending&&<div style={{position:"absolute",top:8,right:8,fontSize:8}}>🔥</div>}
                  {favs.includes(t.id)&&<div style={{position:"absolute",bottom:8,right:8,fontSize:8}}>❤️</div>}
                  {isNew(t.id)&&<div style={{position:"absolute",top:6,left:6,padding:"2px 5px",borderRadius:4,background:"#20c870",color:"#000",fontSize:7,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,letterSpacing:"0.08em",boxShadow:"0 0 8px #20c87060"}}>NEW</div>}
                  <div style={{display:"flex",gap:3,marginBottom:10,alignItems:"flex-end"}}>
                    {[{fill:t.up,h:20},{fill:t.dn,h:14},{fill:t.up,h:24},{fill:t.up,h:17},{fill:t.dn,h:19}].map((cv,ci)=>(<div key={ci} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}><div style={{width:2,height:3,background:t.wk,borderRadius:1}}/><div style={{width:7,height:cv.h,borderRadius:2,background:cv.fill,boxShadow:(tg||active)?"0 0 8px "+cv.fill+"90, 0 0 16px "+cv.fill+"40":"none",filter:(tg||active)?"brightness(1.1)":"none"}}/><div style={{width:2,height:2,background:t.wk,borderRadius:1}}/></div>))}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                    <div style={{fontSize:10,fontFamily:"'Space Grotesk',sans-serif",color:active?t.tx:"rgba(255,255,255,0.5)",fontWeight:700,letterSpacing:"0.04em",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}><Highlight text={t.name} query={search} color={t.ac}/></div>
                    <ColorDNA th={t} size={18}/>
                  </div>
                  {tcm.label&&<div style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",color:tcm.dot,letterSpacing:"0.1em",opacity:0.8}}>{tcm.label}</div>}
                  {(()=>{const r=getContrast(t.up,t.bg);const b=contrastBadge(r);return(<div style={{marginTop:4,display:"inline-block",padding:"1px 5px",borderRadius:4,background:`${b.color}18`,border:`1px solid ${b.color}40`,fontSize:7,fontFamily:"'JetBrains Mono',monospace",color:b.color,letterSpacing:"0.08em"}}>{b.label} {r.toFixed(1)}:1</div>);})()}
                </button>
              );
            })}
          </div>

          {/* MAIN DETAIL */}
          <div id="kit-detail" className="detail-grid" style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:40,alignItems:"start"}} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

            {/* LEFT CARD */}
            <div className="sticky-card" style={{position:"sticky",top:80}}>
              <div key={th.id} className="kit-slide slide-left glass-deep glass-shimmer" style={{borderRadius:24,...glassStyle,overflow:"hidden",boxShadow:glow?`0 24px 80px rgba(0,0,0,0.6), 0 0 60px ${th.ac}15`:"0 24px 60px rgba(0,0,0,0.5)"}}>
                <div style={{height:2,background:`linear-gradient(90deg,transparent,${th.ac},transparent)`,opacity:glow?1:0.35}}/>
                <div style={{padding:"32px 28px 24px"}}>
                  {/* Header row */}
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                    <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:th.ac,letterSpacing:"0.3em",textShadow:glow?`0 0 18px ${th.ac}`:"none",flex:1}}>{th.name}</span>
                    {cm.label&&<span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",padding:"3px 8px",borderRadius:20,color:cm.dot,border:`1px solid ${cm.dot}44`,background:cm.dot+"14",letterSpacing:"0.12em"}}>{cm.label}</span>}
                    {/* Fav button */}
                    <button onClick={()=>toggleFav(th.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,opacity:isFav?1:0.25,transition:"all 0.2s",padding:"2px"}} title={isFav?"Remove from favorites":"Add to favorites"}>{isFav?"❤️":"🤍"}</button>
                  </div>
                  <div style={{fontSize:48,fontWeight:800,lineHeight:0.92,fontFamily:"'Space Grotesk',sans-serif",marginBottom:6,letterSpacing:"-0.03em",color:"#f0f0f0",textShadow:glow?`0 0 40px ${th.ac}30`:"none"}}>Chart<br/>Colors</div>
                  <div style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#282828",letterSpacing:"0.1em",marginBottom:24}}>{th.tag.toUpperCase()}</div>

                  {/* Chart preview toggle */}
                  {/* Chart Preview Toggle */}
                  <div style={{marginBottom:16}}>
                    <button onClick={()=>setChartMode(m=>m?null:'live')} style={{width:"100%",padding:"10px",borderRadius:10,...glassStyle,color:site.subText,fontSize:11,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",marginBottom:chartMode?8:0,letterSpacing:"0.08em",border:`1px solid ${site.panelBorder}`,transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
                      onMouseEnter={e=>e.currentTarget.style.opacity="0.7"}
                      onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                      <span style={{transition:"transform 0.2s",display:"inline-block",transform:chartMode?"rotate(180deg)":"rotate(0deg)"}}>▼</span>
                      {chartMode?"▲ HIDE PREVIEW":"▼ SHOW CHART PREVIEW"}
                    </button>
                    {chartMode&&(
                      <div>
                        {/* Mode tabs */}
                        <div style={{display:"flex",gap:6,marginBottom:8}}>
                          {[['static','📊 STATIC'],['live','● LIVE']].map(([mode,label])=>(
                            <button key={mode} onClick={()=>setChartMode(mode)} style={{flex:1,padding:"7px",borderRadius:8,background:chartMode===mode?th.ac:"rgba(255,255,255,0.04)",color:chartMode===mode?"#000":site.subText,border:`1px solid ${chartMode===mode?th.ac:"rgba(255,255,255,0.08)"}`,fontSize:10,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",transition:"all 0.18s",fontWeight:chartMode===mode?"700":"400",letterSpacing:"0.08em"}}>
                              {label}
                            </button>
                          ))}
                        </div>
                        {/* Candle style switcher */}
                        <div style={{display:"flex",gap:4,marginBottom:6}}>
                          {[['candles','▊'],['hollow','▯'],['ha','HA'],['bars','|']].map(([style,icon])=>(
                            <button key={style} onClick={()=>setCandleStyle(style)} title={{candles:"Candles",hollow:"Hollow Candles",ha:"Heikin Ashi",bars:"Bars"}[style]} style={{flex:1,padding:"5px 4px",borderRadius:6,background:candleStyle===style?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.03)",color:candleStyle===style?"#fff":"#333",border:`1px solid ${candleStyle===style?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.06)"}`,fontSize:10,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",transition:"all 0.15s",fontWeight:candleStyle===style?"700":"400"}}>
                              {icon}
                            </button>
                          ))}
                        </div>
                        {/* Timeframe switcher — static only */}
                        {chartMode==='static'&&(
                          <div style={{display:"flex",gap:4,marginBottom:10}}>
                            {['M1','M5','H1','D1'].map(tf=>(
                              <button key={tf} onClick={()=>setTimeframe(tf)} style={{flex:1,padding:"4px 4px",borderRadius:6,background:timeframe===tf?th.ac+"33":"rgba(255,255,255,0.03)",color:timeframe===tf?th.ac:"#333",border:`1px solid ${timeframe===tf?th.ac+"66":"rgba(255,255,255,0.06)"}`,fontSize:9,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",transition:"all 0.15s",fontWeight:timeframe===tf?"700":"400",letterSpacing:"0.05em"}}>
                                {tf}
                              </button>
                            ))}
                          </div>
                        )}
                        {/* Both always mounted — CSS toggle prevents unmount crash */}
                        <div style={{display:chartMode==='static'?'block':'none'}}>
                          <MockChart th={th} fam={fam} candleStyle={candleStyle} timeframe={timeframe}/>
                        </div>
                        <div style={{display:chartMode==='live'?'block':'none',position:"relative"}}>
                          <LiveChart th={th} fam={fam} candleStyle={candleStyle}/>
                          <button onClick={()=>setShowFullChart(true)} style={{position:"absolute",bottom:26,left:"50%",transform:"translateX(-50%)",padding:"5px 14px",borderRadius:16,background:"rgba(0,0,0,0.55)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.7)",fontSize:9,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",letterSpacing:"0.1em",backdropFilter:"blur(8px)"}}>
                            ⤢ FULLSCREEN
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mini cube — mobile only (desktop has hero cube) */}
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
                      <div key={label} className="color-transition" style={{display:"flex",alignItems:"center",gap:8,padding:"9px 11px",borderRadius:10,background:`${color}10`,border:`1px solid ${color}22`,cursor:"pointer"}}
                        onClick={()=>{navigator.clipboard?.writeText(color.slice(0,7));showToast(`Copied ${label}: ${color.slice(0,7)}`);}}
                        onMouseEnter={e=>e.currentTarget.style.background=`${color}1e`}
                        onMouseLeave={e=>e.currentTarget.style.background=`${color}10`}>
                        <div style={{width:10,height:10,borderRadius:"50%",background:color,boxShadow:"0 0 "+(glow?"16px":"8px")+" "+color,flexShrink:0}}/>
                        <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color,fontWeight:700,letterSpacing:"0.06em"}}>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <button onClick={()=>setShowExport(true)} style={{flex:1,padding:"10px",borderRadius:10,background:"rgba(255,255,255,0.05)",color:"#888",border:"1px solid rgba(255,255,255,0.1)",fontSize:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,cursor:"pointer",letterSpacing:"0.06em"}}>🎨 GRID</button>
                    <button onClick={()=>setShowCard(true)} style={{padding:"10px",borderRadius:10,background:th.ac,color:"#000",border:"none",fontSize:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,cursor:"pointer",letterSpacing:"0.06em",transition:"opacity 0.2s"}}
                      onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                      🖼 CARD
                    </button>
                    <button onClick={shareKit} style={{padding:"10px",borderRadius:10,...glassStyle,color:"#555",border:"1px solid rgba(255,255,255,0.08)",fontSize:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,cursor:"pointer",letterSpacing:"0.06em"}}>
                      🔗 SHARE
                    </button>
                    <button onClick={copyAll} style={{padding:"10px",borderRadius:10,...glassStyle,color:"#555",border:"1px solid rgba(255,255,255,0.08)",fontSize:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,cursor:"pointer",letterSpacing:"0.06em"}}>
                      📋 COPY ALL
                    </button>

                  </div>

                  {/* Community ratings */}
                  {(()=>{const r=ratings[th.id]||{up:0,down:0,myVote:null};return(
                    <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderTop:"1px solid rgba(255,255,255,0.04)",marginTop:10}}>
                      <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#222",letterSpacing:"0.12em",flex:1}}>COMMUNITY RATING</span>
                      <button onClick={()=>rateKit(th.id,'up')} style={{padding:"6px 12px",borderRadius:20,background:r.myVote==="up"?"rgba(0,200,100,0.2)":"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",color:r.myVote==="up"?"#20c870":"#333",fontSize:11,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"}}>👍 {r.up}</button>
                      <button onClick={()=>rateKit(th.id,'down')} style={{padding:"6px 12px",borderRadius:20,background:r.myVote==="down"?"rgba(200,50,50,0.2)":"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",color:r.myVote==="down"?"#e85050":"#333",fontSize:11,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"}}>👎 {r.down}</button>
                    </div>
                  );})()}
                  {/* Gallery + Compare */}
                  <div style={{display:"flex",gap:8,marginTop:8}}>

                    <button onClick={()=>{setCompareMode(v=>!v);if(!compareMode)showToast('Click any kit card to compare');}} style={{flex:1,padding:"9px",borderRadius:10,background:compareMode?"rgba(255,200,0,0.12)":"rgba(255,255,255,0.03)",color:compareMode?"#aa8800":"#444",border:"1px solid rgba(255,255,255,0.07)",fontSize:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,cursor:"pointer",letterSpacing:"0.05em"}}>
                      ⚡ {compareMode?"COMPARING":"COMPARE"}
                    </button>
                  </div>
                  {/* Accessibility heatmap */}
                  <AccessibilityHeatmap th={th} fam={fam}/>
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
                  <button key={s.key} onClick={()=>setTab(s.key)} style={{flex:"0 0 auto",padding:"10px 20px",borderRadius:22,background:a?th.ac:"rgba(255,255,255,0.03)",color:a?"#000":"#404040",border:`1px solid ${a?th.ac:"rgba(255,255,255,0.06)"}`,fontSize:12,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",transition:"all 0.18s",fontWeight:a?"700":"500",whiteSpace:"nowrap",boxShadow:a&&glow?`0 0 22px ${th.ac}55`:"none"}}>
                    {s.label}
                  </button>
                );})}
              </div>
              <div className="glass-deep glass-shimmer" style={{borderRadius:20,overflow:"hidden"}}>
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
                <span style={{fontSize:12,fontFamily:"'Space Grotesk',sans-serif",color:"#333",lineHeight:1.5}}>Copy hex → TradingView → right-click any tool → Edit → paste color</span>
              </div>
            </div>
          </div>

          {/* Swipe hint — mobile only */}
          <div className="swipe-hint" style={{justifyContent:"center",alignItems:"center",gap:8,padding:"8px 0",marginBottom:8}}>
            <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#252525",letterSpacing:"0.1em"}}>← SWIPE TO BROWSE KITS →</span>
          </div>

          {/* KITS LIKE THIS */}
          {getSimilar(th,palette,4).map(t=>{const f=t[palette]||t.match;const tg=["NEON","VIBE","DEGEN","CYBER","FREAK","AURA","GUM","FREE","ANIME","MEME"].includes(t.cat);const bg=SBGS[t.id]||PHANTOM_SBGS[t.id]||t.bg;const r=getContrast(t.up,t.bg);const b=contrastBadge(r);return null;}).filter(Boolean).length>0&&(
            <div style={{marginBottom:48}}>
              <div style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"#1e1e1e",letterSpacing:"0.25em",marginBottom:14}}>✦ KITS LIKE THIS</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
                {getSimilar(th,palette,4).map(t=>{
                  const f=t[palette]||t.match;
                  const tg=["NEON","VIBE","DEGEN","CYBER","FREAK","AURA","GUM","FREE","ANIME","MEME"].includes(t.cat);
                  const bg=SBGS[t.id]||PHANTOM_SBGS[t.id]||t.bg;
                  const r=getContrast(t.up,t.bg);const b=contrastBadge(r);
                  return(
                    <button key={t.id} onClick={()=>setTheme(t.id)} className="kit-card" style={{padding:"14px 12px",borderRadius:12,background:bg,border:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",textAlign:"left",backdropFilter:"blur(8px)"}}>
                      <div style={{display:"flex",gap:4,marginBottom:8}}>
                        <div style={{width:15,height:15,borderRadius:4,background:t.up,border:"1px solid rgba(255,255,255,0.12)",boxShadow:tg?`0 0 8px ${t.up}80`:"none"}}/>
                        <div style={{width:15,height:15,borderRadius:4,background:t.dn}}/>
                      </div>
                      <div style={{fontSize:10,fontFamily:"'Space Grotesk',sans-serif",color:t.tx,fontWeight:700,marginBottom:6}}>{t.name}</div>
                      <div style={{display:"flex",gap:4,alignItems:"center"}}>
                        {[f.opens,f.highs,f.lows,f.mids].map((col,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:col}}/>)}
                        <div style={{marginLeft:"auto",padding:"1px 4px",borderRadius:3,background:`${b.color}18`,fontSize:7,fontFamily:"'JetBrains Mono',monospace",color:b.color}}>{b.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div style={{borderTop:"1px solid rgba(255,255,255,0.04)",marginTop:80,padding:"28px 0",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
            <div style={{width:22,height:22,borderRadius:6,background:`linear-gradient(135deg,${th.ac},${th.ac}55)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>◈</div>
            <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#1e1e1e",letterSpacing:"0.15em"}}>TRADING COLOR KITS · 115 THEMES · 16 CATEGORIES</span>
            <div style={{flex:1}}/>
            <a href="https://x.com/_a_Sian_" target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:20,...glassStyle,textDecoration:"none",transition:"all 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#444"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"#383838",letterSpacing:"0.08em"}}>made by</span>
              <span style={{fontSize:11,fontFamily:"'Space Grotesk',sans-serif",color:"#555",fontWeight:700}}>aSian</span>
            </a>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* Kit hover tooltip */}
      {tooltip&&(()=>{const t=tooltip.t;const f=t[palette]||t.match;const tg=["NEON","VIBE","DEGEN","CYBER","FREAK","AURA","GUM","FREE","ANIME","MEME"].includes(t.cat);const bg=SBGS[t.id]||PHANTOM_SBGS[t.id]||t.bg;return(
        <div style={{position:"fixed",left:tooltip.x,top:tooltip.y,transform:"translateX(-50%)",zIndex:600,pointerEvents:"none",animation:"fadeUp 0.2s ease"}}>
          <div style={{background:bg,borderRadius:14,padding:"12px",border:"1px solid rgba(255,255,255,0.1)",boxShadow:"0 16px 48px rgba(0,0,0,0.7)",minWidth:200,maxWidth:240}}>
            <div style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:t.ac,letterSpacing:"0.2em",marginBottom:4,textShadow:tg?"0 0 10px "+t.ac:"none"}}>{t.name} · {CAT_META[t.cat]?.label||"CLASSIC"}</div>
            <MockChart th={t} fam={f} candleStyle="candles"/>
            <div style={{display:"flex",gap:6,marginTop:8}}>
              {[["OPENS",f.opens],["HIGHS",f.highs],["LOWS",f.lows],["MIDS",f.mids]].map(([lbl,col])=>(
                <div key={lbl} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:col,boxShadow:"0 0 8px "+col}}/>
                  <span style={{fontSize:6,fontFamily:"'JetBrains Mono',monospace",color:col,letterSpacing:"0.08em"}}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{width:10,height:10,background:bg,transform:"rotate(45deg) translateX(-50%)",position:"absolute",top:-5,left:"50%",border:"1px solid rgba(255,255,255,0.1)",borderBottom:"none",borderRight:"none"}}/>
        </div>
      );})()}

      {/* Back to top button */}
      {scrollY>400&&(
        <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
          style={{position:"fixed",bottom:28,right:24,zIndex:500,padding:"10px 16px",borderRadius:24,background:"rgba(12,12,22,0.92)",border:"1px solid rgba(255,255,255,0.12)",color:"#666",fontSize:11,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",backdropFilter:"blur(12px)",boxShadow:"0 4px 20px rgba(0,0,0,0.5)",transition:"all 0.2s",letterSpacing:"0.08em",display:"flex",alignItems:"center",gap:6}}
          onMouseEnter={e=>{e.currentTarget.style.color="#e0dcd8";e.currentTarget.style.borderColor="rgba(255,255,255,0.2)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="#666";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";}}>
          ↑ TOP
        </button>
      )}

      {/* Sticky "currently viewing" pill */}
      {scrollY>300&&(
        <div style={{position:"fixed",top:76,right:16,zIndex:500,padding:"7px 12px",borderRadius:20,background:"rgba(8,8,18,0.92)",border:"1px solid rgba(255,255,255,0.1)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 20px rgba(0,0,0,0.5)",animation:"fadeIn 0.2s ease",cursor:"pointer"}}
          onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>
          <div style={{width:8,height:8,borderRadius:"50%",background:th.ac,boxShadow:"0 0 8px "+th.ac,flexShrink:0,animation:"pulseGlow 2s ease-in-out infinite"}}/>
          <span style={{fontSize:10,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,color:"#888",letterSpacing:"0.04em",maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{th.name}</span>
          <span style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",color:"#2a2a2a"}}>↑</span>
        </div>
      )}

      {showCard&&<CardGenerator th={th} fam={fam} glow={glow} onClose={()=>setShowCard(false)}/>}
      {showFullChart&&<FullscreenChart th={th} fam={fam} candleStyle={candleStyle} setCandleStyle={setCandleStyle} onClose={()=>setShowFullChart(false)}/>}
      {showCompare&&compareId&&(()=>{const th2=THEMES.find(t=>t.id===compareId)||THEMES[0];const fam2=th2[palette];const g2=["NEON","VIBE","DEGEN","CYBER","FREAK","AURA","GUM","FREE","ANIME","MEME"].includes(th2.cat);return(<CompareModal th1={th} th2={th2} fam1={fam} fam2={fam2} glow1={glow} glow2={g2} onClose={()=>{setShowCompare(false);setCompareMode(false);}}/>);})()}}
      {showKB&&<KBModal onClose={()=>setShowKB(false)} ac={th.ac}/>}
      {showCmd&&<CommandPalette themes={THEMES} onSelect={(id)=>{setTheme(id);setFilter("ALL");}} onClose={()=>setShowCmd(false)} palette={palette} favs={favs} toggleFav={toggleFav} randomKit={randomKit} ac={th.ac}/>}
      {showRoast&&<RoastModal th={th} onClose={()=>setShowRoast(false)}/> }
      {showExport&&<ColorExportModal th={th} fam={fam} onClose={()=>setShowExport(false)}/>}
      {showSetup&&<SetupCardModal th={th} fam={fam} glow={glow} onClose={()=>setShowSetup(false)}/>}
      {showScreensaver&&<Screensaver themes={THEMES} onExit={()=>setShowScreensaver(false)}/>}
      {showChangelog&&<ChangelogModal onClose={()=>setShowChangelog(false)} ac={th.ac}/>}
      <Toast msg={toast}/>
    </div>
  );
}
