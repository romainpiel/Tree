define([
    "sigma.min"
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
                    minEdgeSize: 1,
                    maxEdgeSize: 1
                }).mouseProperties({
                    maxRatio: 32
                });
            },

            add: function(username, users) {

                this.sigInst.addNode(username, {
                    label: username, 
                    color: 'rgb('+Math.round(Math.random()*256)+','+
                        Math.round(Math.random()*256)+','+
                        Math.round(Math.random()*256)+')',
                    x: Math.random(),
                    y: Math.random()
                });

                for (i in users) {

                    try {
                        this.sigInst.addNode(users[i], {
                            label: users[i], 
                            color: 'rgb('+Math.round(Math.random()*256)+','+
                                Math.round(Math.random()*256)+','+
                                Math.round(Math.random()*256)+')',
                            x: Math.random(),
                            y: Math.random()
                        });
                    } catch(e) {

                    }
                    
                    this.sigInst.addEdge(username+"_"+users[i], username, users[i]);
                }

                this.sigInst.draw();

            }
        }
        return that;
    }

    return Graph;

})