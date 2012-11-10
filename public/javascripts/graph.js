define([
    "sigma.forceatlas2"
], function(sigma) {

    var Graph = function() {

        var that = {

            sigInst: null,

            forceAtlas2Started: false,

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
                    maxNodeSize: 1,
                    minEdgeSize: 0.5,
                    maxEdgeSize: 1
                }).mouseProperties({
                    maxRatio: 32
                }).configProperties({
                    auto: 0    // don't hide edges on animations
                });
            },

            add: function(username, users) {

                this.addNode(username);

                for (i in users) {
                    this.addNode(users[i]);
                    this.addEdge(users[i], username);
                }

                this.sigInst.draw();

                // this needs to be started only once but it doesn't work when no point
                if (!this.forceAtlas2Started && users.length > 0) {
                    this.sigInst.startForceAtlas2();
                    this.forceAtlas2Started = true;
                }

            },

            addNode: function(id) {
                try {
                    this.sigInst.addNode(id, {
                        label: id, 
                        color: 'rgb('+Math.round(Math.random()*256)+','+
                            Math.round(Math.random()*256)+','+
                            Math.round(Math.random()*256)+')',
                        x: Math.random(),
                        y: Math.random()
                    });
                } catch(e) {

                }
            },

            addEdge: function(from, to) {
                this.sigInst.addEdge(from+"_"+to, from, to);
            }
        }
        return that;
    }

    return Graph;

})