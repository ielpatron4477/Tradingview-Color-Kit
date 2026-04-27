import { useState } from "react";
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
];
const SBGS={synthwave:"radial-gradient(ellipse at top left,#200838 0%,#0d0618 60%)",twilight:"radial-gradient(ellipse at top right,#1c1440 0%,#0e0c1e 60%)",matrix:"radial-gradient(ellipse at bottom,#031803 0%,#010c01 65%)",bloodmoon:"radial-gradient(ellipse at top,#1c0404 0%,#0c0404 70%)",sol:"radial-gradient(135deg,#140a28 0%,#080412 65%)",uranium:"radial-gradient(ellipse at top,#081508 0%,#040804 70%)",velvet:"radial-gradient(ellipse at top left,#1c0e24 0%,#0e0810 60%)",bitcoin:"radial-gradient(ellipse at top,#1e1000 0%,#100800 70%)",pepe:"radial-gradient(ellipse at bottom,#0a1a08 0%,#071006 65%)",ghost:"radial-gradient(ellipse at center,#0e0e18 0%,#08080e 70%)",fire:"radial-gradient(ellipse at top,#1c0600 0%,#100400 70%)",neonnoir:"radial-gradient(ellipse at top,#1a0820 0%,#060810 70%)",plasma:"radial-gradient(ellipse at top left,#200818 0%,#080412 60%)",goldleaf:"radial-gradient(ellipse at top,#1e1808 0%,#141008 65%)",royal:"radial-gradient(ellipse at top left,#0c1428 0%,#080c18 60%)",purpleaura:"radial-gradient(ellipse at center,#180e28 0%,#100c1c 70%)",goldenaura:"radial-gradient(ellipse at top,#1c1408 0%,#100c04 70%)",dragon:"radial-gradient(ellipse at top,#1c1004 0%,#0c0804 70%)",shohen:"radial-gradient(ellipse at top left,#0c1030 0%,#0c0e1c 65%)",bubblegumpop:"radial-gradient(ellipse at top,#280c30 0%,#1a0818 65%)",acidtrip:"radial-gradient(135deg,#0c0418 0%,#060408 100%)",acid:"radial-gradient(135deg,#100618 0%,#080408 100%)",glitch:"radial-gradient(ellipse at center,#080818 0%,#040408 70%)",disco:"radial-gradient(ellipse at top,#1a0c0c 0%,#0c0810 70%)",mortis:"radial-gradient(ellipse at top,#140408 0%,#080204 70%)",cottoncandy:"linear-gradient(135deg,#fce8fc 0%,#f8eef8 100%)",onyx:"linear-gradient(180deg,#0c0c0c 0%,#080808 100%)",blueprint:"linear-gradient(135deg,#080e18 0%,#060e18 100%)"};
const SGLO={matrix:"0 0 80px #00c83240",bloodmoon:"0 0 80px #e0402040",sol:"0 0 80px #9945ff40",uranium:"0 0 80px #80d00040",velvet:"0 0 80px #a050c840",bitcoin:"0 0 80px #f7931a40",pepe:"0 0 80px #46c82840",ghost:"0 0 60px #8888c030",fire:"0 0 80px #ff602040",cyber:"0 0 70px #00c8b840",aurora:"0 0 70px #30d0b040",plasma:"0 0 70px #e040d040",laser:"0 0 70px #40e04050",neonnoir:"0 0 70px #ff30a040",purpleaura:"0 0 60px #a068e840",goldenaura:"0 0 60px #e0a82040",acid:"0 0 60px #ff40ff30",glitch:"0 0 70px #00ffcc30",dragon:"0 0 70px #d0401030",shohen:"0 0 60px #ff802030",bubblegumpop:"0 0 70px #ff40c040",acidtrip:"0 0 60px #8040ff40",disco:"0 0 50px #e0a02030",doge:"0 0 50px #d4a01030",pump:"0 0 60px #20e86030",eth:"0 0 50px #627eea30",chromepunk:"0 0 50px #80a0b830",mortis:"0 0 50px #b0203030",cottoncandy:"0 0 40px #d060b020",goldleaf:"0 0 60px #d4a83030",royal:"0 0 50px #c8a03030"};
const PAL={match:{icon:"◉",label:"MATCH",desc:"Blends with chart"},vivid:{icon:"◈",label:"VIVID",desc:"Max contrast for content"}};

function tools(O,H,L,M,A){return{fib:[{level:"0",hex:L},{level:"0.236",hex:op(L,60)},{level:"0.382",hex:op(L,45)},{level:"0.5",hex:M},{level:"0.618",hex:A},{level:"0.705",hex:op(H,55)},{level:"0.786",hex:op(H,75)},{level:"1",hex:H},{level:"1.618",hex:op(H,82)}],lines:{trend:A,ray:op(A,74),hline:op(A,56),vline:op(A,44)},zones:{support:op(L,28),resistance:op(H,28),bull:op(L,18),bear:op(H,18),fvg:op(M,24),orderBlock:op(A,20),equilibrium:op(M,20),premium:op(H,14),discount:op(L,14)},mas:{ma1:O,ma2:A,ma3:M,ma4:L,ma5:H},channels:{outerBand:A,midline:op(A,60),fill:op(A,9),extended:op(A,44)},vwap:{vwap:O,anchor:M,band1pos:op(H,74),band1neg:op(L,74),band2pos:op(H,54),band2neg:op(L,54),band3pos:op(H,36),band3neg:op(L,36)},pivots:{r3:H,r2:op(H,80),r1:op(H,64),pp:O,s1:op(L,64),s2:op(L,80),s3:L,weekly:op(A,50),monthly:op(A,34)},fractals:{fractalUp:H,fractalDown:L,fractalZone:op(M,18)},volProfile:{poc:O,valueArea:op(M,24),vah:H,val:L,hvn:A,lvn:op(A,38)},indicators:{rsi:A,macd:O,macdSig:M,histBull:L,histBear:H,bbUp:op(H,62),bbDn:op(L,62),bbFill:op(M,9)},ict:{ifvg:op(M,28),breaker:op(H,30),mitigation:op(L,26),rejection:op(H,24),bos:H,choch:M,mss:op(H,74),liqSweep:O,kzLon:op(O,9),kzNY:op(H,7),kzAsia:op(L,7),kzSyd:op(M,7),ote:op(M,24),po3Bull:op(L,28),po3Bear:op(H,28),silverBullet:op(O,14),pdh:H,pdl:L},kl:{dOpen:O,wOpen:O,mOpen:O,yOpen:O,rthOpen:O,pdc:op(O,62),pdh:H,pwh:H,pmh:H,monHigh:op(H,74),rthHigh:op(H,74),prevRthH:op(H,58),onHigh:op(H,58),srDayR:op(H,24),srWkR:op(H,18),srMoR:op(H,13),pdl:L,pwl:L,pml:L,monLow:op(L,74),rthLow:op(L,74),prevRthL:op(L,58),onLow:op(L,58),srDayS:op(L,24),srWkS:op(L,18),srMoS:op(L,13),monMid:M,rthMid:M,onMid:op(M,74),wkMid:op(M,74),moMid:op(M,58),rthFill:op(O,6),onFill:op(M,6),lonFill:op(H,5),nyFill:op(L,5)}}}

function ColorRow({hex,label,sub,th,isLine=true}){
  const[cp,sc]=useState(false);
  const b=hex.slice(0,7);
  return(<div onClick={()=>{navigator.clipboard?.writeText(b);sc(true);setTimeout(()=>sc(false),1500);}}
    onMouseEnter={e=>{e.currentTarget.style.background=th.tx+"0a";e.currentTarget.style.transform="translateX(4px)";}}
    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.transform="none";}}
    style={{display:"flex",alignItems:"center",gap:16,padding:"11px 16px",borderRadius:10,cursor:"pointer",transition:"all 0.15s",marginBottom:4}}>
    <div style={{width:40,height:isLine?6:24,borderRadius:isLine?3:7,background:hex,flexShrink:0,boxShadow:`0 2px 10px ${hex}55`}}/>
    <div style={{flex:1}}>
      <div style={{fontSize:15,color:th.tx,fontWeight:500,letterSpacing:"0.01em"}}>{label}</div>
      {sub&&<div style={{fontSize:11,fontFamily:"monospace",color:th.tx,opacity:0.38,marginTop:2}}>{sub}</div>}
    </div>
    <div style={{fontSize:11,fontFamily:"monospace",color:cp?th.ac:th.tx,opacity:cp?1:0.28,transition:"all 0.2s",letterSpacing:"0.07em",flexShrink:0}}>{cp?"✓ COPIED":b.toUpperCase()}</div>
  </div>);
}

function SectionHeader({color,label}){
  return(<div style={{display:"flex",alignItems:"center",gap:10,margin:"24px 0 10px",paddingTop:20,borderTop:"1px solid rgba(128,128,128,0.1)"}}>
    <div style={{width:10,height:10,borderRadius:"50%",background:color,boxShadow:`0 0 14px ${color}`,flexShrink:0}}/>
    <span style={{fontSize:11,letterSpacing:"0.28em",fontFamily:"monospace",color,fontWeight:700}}>{label}</span>
    <div style={{flex:1,height:1,background:color,opacity:0.12}}/>
  </div>);
}

const Candle=({fill,wick,glow})=>(<div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
  <div style={{width:3,height:18,background:wick,borderRadius:2,boxShadow:glow?`0 0 8px ${wick}99`:"none"}}/>
  <div style={{width:22,height:52,background:fill,border:`2px solid ${wick}55`,borderRadius:5,boxShadow:glow?`0 0 24px ${fill}90,0 6px 20px rgba(0,0,0,0.4)`:"0 4px 16px rgba(0,0,0,0.4)"}}/>
  <div style={{width:3,height:12,background:wick,borderRadius:2}}/>
</div>);

function renderKL(T,th,F){const{opens:O,highs:H,lows:L,mids:M}=F;const k=T.kl;return(<div>
  <SectionHeader color={O} label="OPENS — NEUTRAL REFERENCE"/>
  {[[k.dOpen,"Daily Open","dOpen"],[k.wOpen,"Weekly Open","wOpen"],[k.mOpen,"Monthly Open","mOpen"],[k.yOpen,"Yearly Open","yOpen"],[k.rthOpen,"RTH Open","Regular Trading Hours"],[k.pdc,"Prev Day Close","PDC"]].map(([h,l,s])=><ColorRow key={l} hex={h} label={l} sub={s} th={th}/>)}
  <SectionHeader color={H} label="RESISTANCE — HIGHS"/>
  {[[k.pdh,"Prev Day High","PDH"],[k.pwh,"Prev Week High","PWH"],[k.pmh,"Prev Month High","PMH"],[k.monHigh,"Monday High",""],[k.rthHigh,"RTH High",""],[k.onHigh,"Overnight High","ONH"],[k.srDayR,"Daily Resistance","Fill",false],[k.srWkR,"Weekly Resistance","Fill",false]].map(([h,l,s,ln=true])=><ColorRow key={l} hex={h} label={l} sub={s} th={th} isLine={ln}/>)}
  <SectionHeader color={L} label="SUPPORT — LOWS"/>
  {[[k.pdl,"Prev Day Low","PDL"],[k.pwl,"Prev Week Low","PWL"],[k.pml,"Prev Month Low","PML"],[k.monLow,"Monday Low",""],[k.rthLow,"RTH Low",""],[k.onLow,"Overnight Low","ONL"],[k.srDayS,"Daily Support","Fill",false],[k.srWkS,"Weekly Support","Fill",false]].map(([h,l,s,ln=true])=><ColorRow key={l} hex={h} label={l} sub={s} th={th} isLine={ln}/>)}
  <SectionHeader color={M} label="MIDPOINTS"/>
  {[[k.monMid,"Monday Midpoint"],[k.rthMid,"RTH Midpoint"],[k.onMid,"Overnight Mid"],[k.wkMid,"Weekly Mid"],[k.moMid,"Monthly Mid"]].map(([h,l])=><ColorRow key={l} hex={h} label={l} th={th}/>)}
  <SectionHeader color={O} label="SESSION FILLS"/>
  {[[k.rthFill,"RTH Background","RTH",false],[k.onFill,"Overnight / Globex","Globex",false],[k.lonFill,"London Killzone","02:00–05:00 EST",false],[k.nyFill,"New York Killzone","07:00–10:00 EST",false]].map(([h,l,s])=><ColorRow key={l} hex={h} label={l} sub={s} th={th} isLine={false}/>)}
</div>);}

function renderICT(T,th,F){const{opens:O,highs:H,lows:L,mids:M}=F;const ic=T.ict;return(<div>
  <SectionHeader color={M} label="STRUCTURE"/>
  {[[ic.bos,"BOS — Break of Structure"],[ic.choch,"ChoCH — Change of Character"],[ic.mss,"MSS — Market Structure Shift"],[ic.liqSweep,"Liquidity Sweep / BSL-SSL"]].map(([h,l])=><ColorRow key={l} hex={h} label={l} th={th}/>)}
  <SectionHeader color={H} label="BEARISH BLOCKS"/>
  {[[ic.breaker,"Breaker Block","Fill",false],[ic.rejection,"Rejection Block","Fill",false],[ic.po3Bear,"PO3 — Bearish","Fill",false],[ic.pdh,"Prev Day High","PDH"]].map(([h,l,s,ln=true])=><ColorRow key={l} hex={h} label={l} sub={s} th={th} isLine={ln}/>)}
  <SectionHeader color={L} label="BULLISH BLOCKS"/>
  {[[ic.mitigation,"Mitigation Block","Fill",false],[ic.po3Bull,"PO3 — Bullish","Fill",false],[ic.pdl,"Prev Day Low","PDL"]].map(([h,l,s,ln=true])=><ColorRow key={l} hex={h} label={l} sub={s} th={th} isLine={ln}/>)}
  <SectionHeader color={M} label="ENTRY MODELS"/>
  {[[ic.ifvg,"IFVG — Inverse FVG","Fill"],[ic.ote,"OTE — Optimal Trade Entry","0.62–0.79 zone"],[ic.silverBullet,"Silver Bullet","10:00–11:00 EST"]].map(([h,l,s])=><ColorRow key={l} hex={h} label={l} sub={s} th={th} isLine={false}/>)}
  <SectionHeader color={O} label="KILLZONES"/>
  {[[ic.kzLon,"London Killzone","02:00–05:00 EST"],[ic.kzNY,"New York Killzone","07:00–10:00 EST"],[ic.kzAsia,"Asian Killzone","20:00–00:00 EST"],[ic.kzSyd,"Sydney Killzone","17:00–19:00 EST"]].map(([h,l,s])=><ColorRow key={l} hex={h} label={l} sub={s} th={th} isLine={false}/>)}
</div>);}

function renderFib(T,th){const notes=["Support base","","","Equilibrium","Golden Ratio","","","Resistance top","Extension"];
  return(<div style={{paddingTop:8}}>{T.fib.map((f,i)=><ColorRow key={f.level} hex={f.hex} label={`${f.level}${notes[i]?" — "+notes[i]:""}`} th={th}/>)}</div>);}

function renderVWAP(T,th,F){const{opens:O,highs:H,lows:L}=F;const v=T.vwap;return(<div>
  <SectionHeader color={O} label="VWAP"/>
  <ColorRow hex={v.vwap} label="VWAP Line" th={th}/><ColorRow hex={v.anchor} label="aVWAP Anchor" th={th}/>
  <SectionHeader color={H} label="UPPER BANDS — RESISTANCE"/>
  {["+1σ Band","+2σ Band","+3σ Band"].map((l,i)=><ColorRow key={l} hex={[v.band1pos,v.band2pos,v.band3pos][i]} label={l} th={th}/>)}
  <SectionHeader color={L} label="LOWER BANDS — SUPPORT"/>
  {["−1σ Band","−2σ Band","−3σ Band"].map((l,i)=><ColorRow key={l} hex={[v.band1neg,v.band2neg,v.band3neg][i]} label={l} th={th}/>)}
</div>);}

function renderZones(T,th,F){const{highs:H,lows:L,mids:M}=F;const z=T.zones;return(<div>
  <SectionHeader color={H} label="BEARISH ZONES"/>
  {[[z.resistance,"Resistance Zone"],[z.bear,"Bearish Box"],[z.premium,"Premium Array"]].map(([h,l])=><ColorRow key={l} hex={h} label={l} th={th} isLine={false}/>)}
  <SectionHeader color={L} label="BULLISH ZONES"/>
  {[[z.support,"Support Zone"],[z.bull,"Bullish Box"],[z.discount,"Discount Array"]].map(([h,l])=><ColorRow key={l} hex={h} label={l} th={th} isLine={false}/>)}
  <SectionHeader color={M} label="NEUTRAL ZONES"/>
  {[[z.fvg,"FVG — Fair Value Gap"],[z.orderBlock,"Order Block"],[z.equilibrium,"Equilibrium Zone"]].map(([h,l])=><ColorRow key={l} hex={h} label={l} th={th} isLine={false}/>)}
</div>);}

function renderOther(T,th){const p=T.pivots;const v=T.volProfile;const m=T.mas;const i=T.indicators;return(<div>
  <SectionHeader color={th.ac} label="PIVOTS"/>
  {[["R3",p.r3],["R2",p.r2],["R1",p.r1],["PP — Pivot Point",p.pp],["S1",p.s1],["S2",p.s2],["S3",p.s3]].map(([l,h])=><ColorRow key={l} hex={h} label={l} th={th}/>)}
  <SectionHeader color={th.ac} label="MOVING AVERAGES"/>
  {[["9 EMA",m.ma1],["21 EMA",m.ma2],["50 SMA",m.ma3],["100 SMA",m.ma4],["200 SMA",m.ma5]].map(([l,h])=><ColorRow key={l} hex={h} label={l} th={th}/>)}
  <SectionHeader color={th.ac} label="VOLUME PROFILE"/>
  <ColorRow hex={v.poc} label="Point of Control (POC)" th={th}/>
  <ColorRow hex={v.vah} label="Value Area High (VAH)" th={th}/>
  <ColorRow hex={v.val} label="Value Area Low (VAL)" th={th}/>
  <ColorRow hex={v.valueArea} label="Value Area Fill" th={th} isLine={false}/>
  <SectionHeader color={th.ac} label="INDICATORS"/>
  <ColorRow hex={i.rsi} label="RSI" th={th}/>
  <ColorRow hex={i.macd} label="MACD Line" th={th}/>
  <ColorRow hex={i.macdSig} label="MACD Signal" th={th}/>
  <ColorRow hex={i.histBull} label="Histogram Bullish" th={th} isLine={false}/>
  <ColorRow hex={i.histBear} label="Histogram Bearish" th={th} isLine={false}/>
  <ColorRow hex={i.bbUp} label="Bollinger Upper" th={th}/>
  <ColorRow hex={i.bbDn} label="Bollinger Lower" th={th}/>
</div>);}

const SECS=[
  {key:"kl",  label:"Key Levels",  render:(T,th,F)=>renderKL(T,th,F)},
  {key:"ict", label:"ICT / SMC",   render:(T,th,F)=>renderICT(T,th,F)},
  {key:"fib", label:"Fibonacci",   render:(T,th,F)=>renderFib(T,th)},
  {key:"vwap",label:"VWAP",        render:(T,th,F)=>renderVWAP(T,th,F)},
  {key:"zones",label:"Zones",      render:(T,th,F)=>renderZones(T,th,F)},
  {key:"other",label:"More Tools", render:(T,th,F)=>renderOther(T,th)},
];

export default function App(){
  const[activeTheme,setTheme]=useState("ember");
  const[palette,setPal]=useState("match");
  const[activeTab,setTab]=useState("kl");
  const[filter,setFilter]=useState("ALL");

  const cats=[{id:"ALL",label:"ALL",dot:"#555"},...Object.entries(CAT_META).map(([id,m])=>({id,label:m.label,dot:m.dot}))];
  const filtered=filter==="ALL"?THEMES:THEMES.filter(t=>t.cat===filter);
  const th=filtered.find(t=>t.id===activeTheme)||filtered[0]||THEMES[0];
  const fam=th[palette];
  const T=tools(fam.opens,fam.highs,fam.lows,fam.mids,th.ac);
  const sec=SECS.find(s=>s.key===activeTab);
  const cm=CAT_META[th.cat]||{label:"",dot:"#888"};
  const glow=["NEON","VIBE","DEGEN","CYBER","FREAK","AURA","GUM","FREE","ANIME","MEME"].includes(th.cat);
  const cardBg=SBGS[th.id]||th.bg;
  const cardGlow=SGLO[th.id]||"none";

  return(
    <div style={{minHeight:"100vh",background:"#030303",color:"#fff",fontFamily:"Georgia,serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;} body{margin:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:#222;border-radius:2px;}
        .noscroll{overflow-x:auto;scrollbar-width:none;}
        .noscroll::-webkit-scrollbar{display:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(3,3,3,0.94)",backdropFilter:"blur(24px)",borderBottom:"1px solid #111",padding:"0 48px",display:"flex",alignItems:"center",gap:24,height:64}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#c8a830,#f0d040)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:"0 0 24px #c8a83060"}}>◈</div>
          <span style={{fontSize:17,fontFamily:"'Space Mono',monospace",fontWeight:700,letterSpacing:"-0.02em"}}>Trading Color Kits</span>
        </div>
        <div style={{flex:1}}/>
        <span style={{fontSize:11,fontFamily:"'Space Mono',monospace",color:"#333",letterSpacing:"0.12em"}}>87 KITS · 16 CATEGORIES</span>
        <div style={{display:"flex",gap:6}}>
          {["match","vivid"].map(p=>{const a=palette===p;return(<button key={p} onClick={()=>setPal(p)} style={{padding:"7px 16px",borderRadius:20,background:a?"#fff":"transparent",color:a?"#000":"#555",border:"1px solid #1e1e1e",fontSize:11,fontFamily:"'Space Mono',monospace",cursor:"pointer",transition:"all 0.2s",fontWeight:a?"700":"400"}}>{PAL[p].icon} {PAL[p].label}</button>);})}
        </div>
      </nav>

      {/* HERO */}
      <div style={{padding:"72px 48px 48px",maxWidth:1440,margin:"0 auto"}}>
        <div style={{fontSize:11,fontFamily:"'Space Mono',monospace",color:"#2a2a2a",letterSpacing:"0.35em",marginBottom:12}}>THE DEFINITIVE TRADINGVIEW COLOR REFERENCE</div>
        <h1 style={{fontSize:"clamp(56px,9vw,108px)",fontWeight:400,lineHeight:0.92,letterSpacing:"-0.035em",marginBottom:20}}>
          Chart<br/><span style={{color:"#2a2a2a"}}>Color</span><br/>Kits
        </h1>
        <p style={{fontSize:16,color:"#444",maxWidth:520,lineHeight:1.7,fontFamily:"'Space Mono',monospace",marginBottom:56}}>
          87 curated color systems for TradingView. Every kit covers Key Levels, ICT/SMC, Fibonacci, VWAP, Zones and more. Click any color to copy the hex.
        </p>

        {/* CATEGORY PILLS */}
        <div className="noscroll" style={{display:"flex",gap:8,marginBottom:28}}>
          {cats.map(c=>{const a=filter===c.id;return(<button key={c.id} onClick={()=>setFilter(c.id)} style={{flex:"0 0 auto",padding:"9px 20px",borderRadius:24,background:a?c.dot:"transparent",color:a?"#000":c.dot,border:`1px solid ${c.dot}${a?"":"40"}`,fontSize:12,fontFamily:"'Space Mono',monospace",cursor:"pointer",transition:"all 0.18s",fontWeight:a?"700":"400",letterSpacing:"0.08em",whiteSpace:"nowrap"}}>{c.label}</button>);})}
        </div>

        {/* THEME GRID */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10,marginBottom:64}}>
          {filtered.map(t=>{
            const tcm=CAT_META[t.cat]||{dot:"#888",label:""};
            const active=th.id===t.id;
            const tg=["NEON","VIBE","DEGEN","CYBER","FREAK","AURA","GUM","FREE","ANIME","MEME"].includes(t.cat);
            const bg=SBGS[t.id]||t.bg;
            const gl=SGLO[t.id]||"none";
            return(<button key={t.id} onClick={()=>setTheme(t.id)}
              style={{padding:"16px 14px",borderRadius:14,background:bg,border:`1.5px solid ${active?t.ac+"99":"#0e0e0e"}`,cursor:"pointer",transition:"all 0.2s",textAlign:"left",
                transform:active?"translateY(-4px) scale(1.03)":"none",
                boxShadow:active?`0 12px 40px ${t.ac}35,${gl}`:`0 2px 8px rgba(0,0,0,0.5)`}}>
              <div style={{display:"flex",gap:5,marginBottom:10}}>
                <div style={{width:16,height:16,borderRadius:4,background:t.up,border:`1px solid ${t.wk}55`,boxShadow:tg?`0 0 10px ${t.up}80`:"none"}}/>
                <div style={{width:16,height:16,borderRadius:4,background:t.dn,border:`1px solid ${t.wk}55`}}/>
              </div>
              <div style={{fontSize:11,fontFamily:"'Space Mono',monospace",color:t.tx,fontWeight:700,letterSpacing:"0.04em",marginBottom:4}}>{t.name}</div>
              {tcm.label&&<div style={{fontSize:9,fontFamily:"'Space Mono',monospace",color:tcm.dot,letterSpacing:"0.1em"}}>{tcm.label}</div>}
            </button>);
          })}
        </div>

        {/* MAIN PANEL */}
        <div style={{display:"grid",gridTemplateColumns:"380px 1fr",gap:40,alignItems:"start"}}>

          {/* LEFT CARD */}
          <div style={{position:"sticky",top:80}}>
            <div style={{borderRadius:24,overflow:"hidden",background:cardBg,boxShadow:`0 24px 80px rgba(0,0,0,0.7),${cardGlow?`0 0 100px ${cardGlow}`:""}`,border:`1px solid ${th.tx}12`,animation:"fadeUp 0.3s ease"}}>
              <div style={{padding:"40px 36px 32px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
                  <span style={{fontSize:12,fontFamily:"'Space Mono',monospace",color:th.ac,letterSpacing:"0.3em",textShadow:glow?`0 0 24px ${th.ac}`:"none"}}>{th.name}</span>
                  {cm.label&&<span style={{fontSize:9,fontFamily:"'Space Mono',monospace",padding:"3px 9px",borderRadius:12,color:cm.dot,border:`1px solid ${cm.dot}55`,background:cm.dot+"1a",letterSpacing:"0.1em",boxShadow:glow?`0 0 14px ${cm.dot}60`:"none"}}>{cm.label}</span>}
                </div>
                <div style={{fontSize:56,fontWeight:400,lineHeight:0.95,color:th.tx,letterSpacing:"-0.025em",marginBottom:10,textShadow:glow?`0 0 48px ${th.ac}40`:"none"}}>Chart<br/>Colors</div>
                <div style={{fontSize:11,fontFamily:"'Space Mono',monospace",color:th.tx,opacity:0.3,letterSpacing:"0.07em",marginBottom:32}}>{th.tag.toUpperCase()}</div>

                {/* Candles */}
                <div style={{display:"flex",gap:14,marginBottom:32,padding:"24px",background:th.sf,borderRadius:16,border:`1px solid ${th.tx}0c`,width:"fit-content"}}>
                  <Candle fill={th.up} wick={th.wk} glow={glow}/>
                  <Candle fill={th.dn} wick={th.wk} glow={glow}/>
                </div>

                {/* Chart color swatches */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:28}}>
                  {Object.values(th.chart).map(s=>(<div key={s.hex} style={{display:"flex",flexDirection:"column",gap:6,alignItems:"center"}}>
                    <div style={{width:"100%",height:40,borderRadius:10,background:s.hex,boxShadow:glow?`0 0 14px ${s.hex}60`:"0 2px 10px rgba(0,0,0,0.3)",border:`1px solid ${th.tx}0e`}}/>
                    <span style={{fontSize:9,fontFamily:"'Space Mono',monospace",color:th.tx,opacity:0.35,textAlign:"center"}}>{s.label.split(" ").slice(0,2).join(" ")}</span>
                  </div>))}
                </div>

                {/* Family dots */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[["OPENS",fam.opens],["HIGHS",fam.highs],["LOWS",fam.lows],["MIDS",fam.mids]].map(([label,color])=>(<div key={label} style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",borderRadius:10,background:color+"14",border:`1px solid ${color}30`}}>
                    <div style={{width:11,height:11,borderRadius:"50%",background:color,boxShadow:`0 0 ${glow?"18px":"10px"} ${color}`}}/>
                    <span style={{fontSize:11,fontFamily:"'Space Mono',monospace",color,fontWeight:700}}>{label}</span>
                  </div>))}
                </div>
              </div>
              <div style={{borderTop:`1px solid ${th.tx}0d`,padding:"18px 36px",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:th.ac,boxShadow:`0 0 10px ${th.ac}`}}/>
                <span style={{fontSize:10,fontFamily:"'Space Mono',monospace",color:th.tx,opacity:0.35,letterSpacing:"0.08em"}}>{PAL[palette].label} PALETTE · {PAL[palette].desc.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div>
            {/* Section tabs */}
            <div className="noscroll" style={{display:"flex",gap:8,marginBottom:20}}>
              {SECS.map(s=>{const a=activeTab===s.key;return(<button key={s.key} onClick={()=>setTab(s.key)} style={{flex:"0 0 auto",padding:"11px 22px",borderRadius:24,background:a?th.ac:"#0c0c0c",color:a?th.bg:"#444",border:`1px solid ${a?th.ac:"#1a1a1a"}`,fontSize:13,fontFamily:"'Space Mono',monospace",cursor:"pointer",transition:"all 0.2s",fontWeight:a?"700":"400",letterSpacing:"0.05em",boxShadow:a&&glow?`0 0 24px ${th.ac}60`:"none",whiteSpace:"nowrap"}}>{s.label}</button>);})}
            </div>

            {/* Content */}
            <div style={{background:"#070707",borderRadius:20,border:"1px solid #0f0f0f",overflow:"hidden"}}>
              <div style={{padding:"14px 24px",borderBottom:"1px solid #0f0f0f",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:th.ac,boxShadow:`0 0 12px ${th.ac}`}}/>
                <span style={{fontSize:11,fontFamily:"'Space Mono',monospace",color:"#2a2a2a",letterSpacing:"0.18em"}}>
                  {SECS.find(s=>s.key===activeTab)?.label.toUpperCase()} · CLICK ANY ROW TO COPY HEX
                </span>
              </div>
              <div style={{padding:"8px 8px 20px",maxHeight:640,overflowY:"auto"}}>
                {sec?.render(T,th,fam)}
              </div>
            </div>

            <div style={{marginTop:16,padding:"16px 24px",background:"#070707",borderRadius:14,border:"1px solid #0f0f0f",display:"flex",gap:14,alignItems:"center"}}>
              <span style={{fontSize:16}}>💡</span>
              <span style={{fontSize:13,fontFamily:"'Space Mono',monospace",color:"#2a2a2a",lineHeight:1.5}}>Copy hex → TradingView → right-click tool → Edit → paste color</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
