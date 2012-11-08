requirejs.config({
    paths: {
        jquery: 'lib/jquery-1.8.2.min',
        arborjs: 'lib/arborjs'
    }
});


// Load the application.
require(
["jquery", "arborjs/renderer", "arborjs/nav", "arborjs/arbor"], function($, Renderer, Nav) {

    var arborData = {
        "nodes": {},
        "edges": {}
    };

    $(function() {

        $("#search-btn").on("click", function() {

            var username = "@" + $("#search-input").val();

            $.ajax({
                url: "followers/",
                type: 'GET',
                data: {
                    user_id: username
                },
                dataType: 'json',
                cache: false

            }).done(function(data) {


                var CLR = {
                    branch: "#b2b19d",
                    code: "orange",
                    doc: "#922E00",
                    demo: "#a7af00"
                }

                var sys = arbor.ParticleSystem()

                var users = data.users;

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
                    //arborData.edges[users[i]] = {};

                    //if (i>30) break;
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

            });
        });

    });


});