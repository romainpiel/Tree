define([
    "jquery",
    "arborjs/renderer", 
    "arborjs/nav", 
    "arborjs/arbor"
], function($, Renderer, Nav) {

    var Graph = function() {

        var arborData = {
            "nodes": {},
            "edges": {}
        };

        var that = {
            build: function(username, users) {
                var CLR = {
                    branch: "#b2b19d",
                    code: "orange",
                    doc: "#922E00",
                    demo: "#a7af00"
                }

                var sys = arbor.ParticleSystem()

                arborData = {
                    "nodes": {},
                    "edges": {}
                };

                arborData.nodes[username] = {
                    color: "red",
                    shape: "dot",
                    alpha: 1
                };
                arborData.edges[username] = {};

                for(i in users) {
                    arborData.nodes[users[i]] = {
                        color: CLR.branch,
                        shape: "dot",
                        alpha: 1
                    };
                    arborData.edges[username][users[i]] = {length:0.8};
                }

                console.log(arborData);

                sys.graft(arborData);
                sys.parameters({
                    stiffness: 0,
                    repulsion: 100,
                    gravity: true,
                    dt: 0.015,
                    friction: 0.5
                })
                sys.renderer = Renderer("#sitemap")

                var nav = Nav("#nav")
                $(sys.renderer).bind('navigate', nav.navigate)
                $(nav).bind('mode', sys.renderer.switchMode)
                nav.init()
            }
        }
        return that;
    }

    return Graph;

})