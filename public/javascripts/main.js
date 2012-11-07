requirejs.config({
    paths: {
        jquery: 'lib/jquery-1.8.2.min',
        arborjs: 'lib/arborjs/'
    }
});


// Load the application.
require(
    [
        "jquery",
        "arborjs/renderer",
        "arborjs/nav",
        "arborjs/arbor"
    ],
    function($, Renderer, Nav){
          
          $(document).ready(function(){
            var CLR = {
              branch:"#b2b19d",
              code:"orange",
              doc:"#922E00",
              demo:"#a7af00"
            }

            var theUI = {
              nodes:{"arbor.js":{color:"red", shape:"dot", alpha:1}, 
              
                     demos:{color:CLR.branch, shape:"dot", alpha:1}, 
                     halfviz:{color:CLR.demo, alpha:0, link:'/halfviz'},
                     atlas:{color:CLR.demo, alpha:0, link:'/atlas'},
                     echolalia:{color:CLR.demo, alpha:0, link:'/echolalia'},

                     docs:{color:CLR.branch, shape:"dot", alpha:1}, 
                     reference:{color:CLR.doc, alpha:0, link:'#reference'},
                     introduction:{color:CLR.doc, alpha:0, link:'#introduction'},

                     code:{color:CLR.branch, shape:"dot", alpha:1},
                     github:{color:CLR.code, alpha:0, link:'https://github.com/samizdatco/arbor'},
                     ".zip":{color:CLR.code, alpha:0, link:'/js/dist/arbor-v0.92.zip'},
                     ".tar.gz":{color:CLR.code, alpha:0, link:'/js/dist/arbor-v0.92.tar.gz'}
                    },
              edges:{
                "arbor.js":{
                  demos:{length:.8},
                  docs:{length:.8},
                  code:{length:.8}
                },
                demos:{halfviz:{},
                       atlas:{},
                       echolalia:{}
                },
                docs:{reference:{},
                      introduction:{}
                },
                code:{".zip":{},
                      ".tar.gz":{},
                      "github":{}
                }
              }
            }


            var sys = arbor.ParticleSystem()
            sys.parameters({stiffness:900, repulsion:2000, gravity:true, dt:0.015})
            sys.renderer = Renderer("#sitemap")
            sys.graft(theUI)
            
            var nav = Nav("#nav")
            $(sys.renderer).bind('navigate', nav.navigate)
            $(nav).bind('mode', sys.renderer.switchMode)
            nav.init()
          })


    }
);