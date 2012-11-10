define([
    "sigma.forceatlas2"
], function(sigma) {

    var Graph = function() {

        var that = {

            sigInst: null,

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
                });
            },

            add: function(username, users) {

                this.addNode(username);

                for (i in users) {
                    this.addNode(users[i]);
                    this.sigInst.addEdge(username+"_"+users[i], username, users[i]);
                }

                this.sigInst.draw();

                this.sigInst.startForceAtlas2();
                var that = this;
                // setTimeout(function() {
                //     that.sigInst.stopForceAtlas2();
                // }, 2000);

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
            }
        }
        return that;
    }

    return Graph;

})