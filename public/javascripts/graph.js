define([
    "jquery",
    "sigma.forceatlas2",
    "api"
], function($, sigma, Api) {

    var api = Api();

    var Graph = function() {

        var that = {

            sigInst: null,

            animationEnabled: true,
            forceAtlas2Started: false,

            popUp: null,

            nodes: {},
            edges: {},

            init: function() {
                var sigRoot = document.getElementById('sig');

                this.sigInst = sigma.init(sigRoot);

                this.sigInst.drawingProperties({
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

            add: function(userid, username, users) {

                this.addNode(userid, "@"+username, true);

                for (i in users) {
                    this.addNode(users[i], users[i]);
                    this.addEdge(users[i], userid);
                }
                this.edges[userid] = users;

                this.sigInst
                    .bind('overnodes', this.showNodeInfo)
                    .bind('outnodes', this.hideNodeInfo)
                    .draw();

                if (this.animationEnabled && !this.forceAtlas2Started) {
                    this.toggleAnimation(true);
                }

            },

            addNode: function(id, label, central) {
                
                try {
                    var properties = {
                        label: label, 
                        color: 'rgb('+Math.round(Math.random()*256)+','+
                            Math.round(Math.random()*256)+','+
                            Math.round(Math.random()*256)+')',
                        x: Math.random(),
                        y: Math.random()
                    };
                    this.sigInst.addNode(id, properties);
                } catch(e) {
                    this.sigInst.iterNodes(function(n) {
                        n.hidden = 0;
                    }, [id]); 
                }

                if (central) {
                    this.sigInst.iterNodes(function(n) {
                        n.label = label;
                        n.color = "white";
                        n.size = 6;
                    }, [id]); 
                }

                if (this.nodes[id]) {
                    this.nodes[id]++;
                } else {
                    this.nodes[id] = 1;
                }
            },

            addEdge: function(from, to) {
                this.sigInst.addEdge(from+"_"+to, from, to);
            },

            deleteNode: function(id) {

                var nodesToHide = [];

                this.nodes[id]--;
                if (this.nodes[id] == 0) {
                    nodesToHide.push(id);
                    delete this.nodes[id];
                } else {
                    this.sigInst.iterNodes(function(n) {
                        n.size = 2;
                        n.color = 'rgb('+Math.round(Math.random()*256)+','+
                            Math.round(Math.random()*256)+','+
                            Math.round(Math.random()*256)+')';
                    }, [id]);
                }

                var edge = this.edges[id],
                    key;
                for (i in edge) {
                    key = edge[i];
                    this.nodes[key]--;
                    if (this.nodes[key] == 0) {
                        nodesToHide.push(key);
                        delete this.nodes[key];
                    }

                    this.sigInst.dropEdge(key+"_"+id);
                }

                delete this.edges[id];

                this.sigInst.iterNodes(function(n) {
                    n.hidden = 1;
                    n.color = 'rgb('+Math.round(Math.random()*256)+','+
                            Math.round(Math.random()*256)+','+
                            Math.round(Math.random()*256)+')';
                    n.size = 2;
                }, nodesToHide);

                this.sigInst.draw();
            },

            hasCentralNode: function(id) {
                return (this.edges[id] != null);
            },

            showNodeInfo: function(event) {
                that.popUp && that.popUp.remove();

                var node;
                that.sigInst.iterNodes(function(n) {
                    node = n;
                }, [event.content[0]]);

                that.popUp = $('<img></img>')
                    .attr('id', 'node-info' + that.sigInst.getID())
                    .attr('src', api.getAvatar(node.label))
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

                $('#sig').append(that.popUp);
            },

            hideNodeInfo: function(event) {
                that.popUp && that.popUp.remove();
                that.popUp = false;
            },

            toggleAnimation: function(flag) {
                if (this.forceAtlas2Started && !flag) {
                    this.sigInst.stopForceAtlas2();
                } else if (!this.forceAtlas2Started && flag) {
                    this.sigInst.startForceAtlas2();
                }
                this.animationEnabled = flag;
                this.forceAtlas2Started = flag;
            }
        }
        return that;
    }

    return Graph;

})