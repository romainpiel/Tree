define([
    "jquery",
    "sigma.forceatlas2",
    "api"
], function($, sigma, Api) {

    var Graph = function() {

        var sigInst = null,

            animationEnabled = true,
            forceAtlas2Started = false,

            popUp = null,

            nodes = {},
            edges = {};

        ///// PUBLIC FUNCTIONS //////
        var that = {

            init: function() {
                var sigRoot = document.getElementById('sig');

                sigInst = sigma.init(sigRoot);

                sigInst.drawingProperties({
                    defaultLabelColor: '#fff',
                    defaultLabelSize: 14,
                    defaultLabelBGColor: '#fff',
                    defaultLabelHoverColor: '#000',
                    labelThreshold: 6,
                    defaultEdgeType: 'curve'
                }).graphProperties({
                    minNodeSize: 2,
                    maxNodeSize: 6,
                    minEdgeSize: 0.5,
                    maxEdgeSize: 1
                }).mouseProperties({
                    maxRatio: 32
                }).configProperties({
                    auto: 0    // don't hide edges on animations
                });
            },

            hasCentralNode: function(id) {
                return (edges[id] != null);
            },

            add: function(userid, username, users) {

                addNode(userid, "@"+username, true);

                for (i in users) {
                    addNode(users[i], users[i]);
                    addEdge(users[i], userid);
                }
                edges[userid] = users;

                sigInst
                    .bind('overnodes', showNodeInfo)
                    .bind('outnodes', hideNodeInfo)
                    .draw();

                if (animationEnabled && !forceAtlas2Started) {
                    this.toggleAnimation(true);
                }

            },

            drop: function(id) {

                var nodesToHide = [];

                nodes[id]--;
                if (nodes[id] == 0) {
                    nodesToHide.push(id);
                    delete nodes[id];
                } else {
                    sigInst.iterNodes(function(n) {
                        n.size = 2;
                        n.color = 'rgb('+Math.round(Math.random()*256)+','+
                            Math.round(Math.random()*256)+','+
                            Math.round(Math.random()*256)+')';
                    }, [id]);
                }

                var edge = edges[id],
                    key;
                for (i in edge) {
                    key = edge[i];
                    nodes[key]--;
                    if (nodes[key] == 0) {
                        nodesToHide.push(key);
                        delete nodes[key];
                    }

                    sigInst.dropEdge(key+"_"+id);
                }

                delete edges[id];

                sigInst.iterNodes(function(n) {
                    n.hidden = 1;
                    n.color = 'rgb('+Math.round(Math.random()*256)+','+
                            Math.round(Math.random()*256)+','+
                            Math.round(Math.random()*256)+')';
                    n.size = 2;
                }, nodesToHide);

                sigInst.draw();
            },

            toggleAnimation: function(flag) {
                if (forceAtlas2Started && !flag) {
                    sigInst.stopForceAtlas2();
                } else if (!forceAtlas2Started && flag) {
                    sigInst.startForceAtlas2();
                }
                animationEnabled = flag;
                forceAtlas2Started = flag;
            }
        }

        ////// PRIVATE FUNCTIONS ////////////
        function addNode(id, label, central) {
                
            try {
                var properties = {
                    label: label, 
                    color: 'rgb('+Math.round(Math.random()*256)+','+
                        Math.round(Math.random()*256)+','+
                        Math.round(Math.random()*256)+')',
                    x: Math.random(),
                    y: Math.random()
                };
                sigInst.addNode(id, properties);
            } catch(e) {
                sigInst.iterNodes(function(n) {
                    n.hidden = 0;
                }, [id]); 
            }

            if (central) {
                sigInst.iterNodes(function(n) {
                    n.label = label;
                    n.color = "white";
                    n.size = 6;
                }, [id]); 
            }

            if (nodes[id]) {
                nodes[id]++;
            } else {
                nodes[id] = 1;
            }
        }

        function addEdge(from, to) {
            sigInst.addEdge(from+"_"+to, from, to);
        }

        function showNodeInfo(event) {
            popUp && popUp.remove();

            var node;
            sigInst.iterNodes(function(n) {
                node = n;
            }, [event.content[0]]);

            popUp = $('<img></img>')
                .attr('id', 'node-info' + sigInst.getID())
                .attr('src', Api.getAvatar(node.label))
                .css({
                    'display': 'inline-block',
                    'border-radius': 3,
                    'padding': 5,
                    'background': '#fff',
                    'color': '#000',
                    'box-shadow': '0 0 4px #666',
                    'position': 'absolute',
                    'left': node.displayX,
                    'top': node.displayY + 15
                });

            $('#sig').append(popUp);
        }

        function hideNodeInfo(event) {
            popUp && popUp.remove();
            popUp = false;
        }

        return $.extend({}, this, that);
    }

    return Graph;

})