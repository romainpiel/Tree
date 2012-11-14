define([
    "sigma.forceatlas2"
], function(sigma) {

    var Graph = function() {

        var that = {

            sigInst: null,

            forceAtlas2Started: false,

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
                    minNodeSize: 0.5,
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

                this.sigInst.draw();

                // this needs to be started only once but it doesn't work when no point
                if (!this.forceAtlas2Started && users.length > 0) {
                    this.sigInst.startForceAtlas2();
                    this.forceAtlas2Started = true;
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
                        n.size = 1;
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
                    n.size = 1;
                }, nodesToHide);

                if (this.forceAtlas2Started && Object.keys(this.nodes).length == 0) {
                    this.sigInst.stopForceAtlas2();
                    this.forceAtlas2Started = false;
                }
            },

            hasCentralNode: function(id) {
                return (this.edges[id] != null);
            }
        }
        return that;
    }

    return Graph;

})