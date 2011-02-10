(function($) {
    
    $(document).ready(function() {
        var diagram = new activities.ui.Diagram('#diagram_level_0');
        var action = new activities.ui.Action(diagram);
        action.x = 60;
        action.y = 100;
        
        var action = new activities.ui.Action(diagram);
        action.x = 220;
        action.y = 40;
        action.selected = true;
        action.label = 'Fooooo';
        
        var decision = new activities.ui.Decision(diagram);
        decision.x = 60;
        decision.y = 200;
        
        var decision = new activities.ui.Decision(diagram);
        decision.x = 200;
        decision.y = 150;
        
        diagram.render();
    });
    
    // activities namespace
    activities = {
        
        // model related
        model: {
            
            // activity model element types
            types: {
                ACTIVITY   : 0,
                INITIAL    : 1,
                FORK       : 2,
                JOIN       : 3,
                DECISION   : 4,
                MERGE      : 5,
                FLOW_FINAL : 6,
                FINAL      : 7,
                ACTION     : 8,
                EDGE       : 9
            },
            
            // constructors
            
            // the model.
            // expects JSON response as context
            Model: function(context) {
                this.context = context;
            }
        },
        
        // rendering elements
        ui: {
            
            // constructors
            
            // Diagram element
            // refers to activity model
            Diagram: function(selector) {
                this.canvas = $(selector).get(0);
                this.context = this.canvas.getContext("2d");
                this.width = this.canvas.width;
                this.height = this.canvas.height;
                this.elements = new Array();
            },
            
            // Action element
            // refers to activity action, initial node, final node
            Action: function(diagram) {
                this.diagram = diagram;
                this.diagram.add(this);
                this.x = 0;
                this.y = 0;
                this.width = 100;
                this.height = 70;
                this.fillColor = '#3ce654';
                this.borderColor = '#ffc000';
                this.borderWidth = 3;
                this.label = 'Action';
                this.selected = false;
            },
            
            // Decision element
            Decision: function(diagram) {
                this.diagram = diagram;
                this.diagram.add(this);
                this.x = 0;
                this.y = 0;
                this.sideLength = 40;
                this.fillColor = '#c6c6c6';
                this.borderColor = '#000';
                this.borderWidth = 2;
            },
            
            // Join element
            Join: function(diagram) {
                this.diagram = diagram;
                this.diagram.add(this);
            },
            
            // Fork element
            Fork: function(diagram) {
                this.diagram = diagram;
                this.diagram.add(this);
            },
            
            // Connection element
            Connection: function(diagram) {
                this.diagram = diagram;
                this.diagram.add(this);
            }
        }
    }
    
    // activities.model.Model member functions
    $.extend(activities.model.Model.prototype, {
    
        // search context for child objects providing given model element type.
        // optional node for searching could be given, otherwise this.context
        // is used. an object named 'children' is expected which gets searched
        // for child nodes.
        filtered: function(type, node) {
            var context;
            if (node) {
                context = node;
            } else {
                context = this.context;
            }
            var ret = new Array();
            if (!context.children) {
                return ret;
            }
            for (var key in context.children) {
                if (context.children[key].type == type) {
                    ret.push(context.children[key]);
                }
            }
            return ret;
        },
        
        // return array of incoming edges for given node
        incoming: function(node) {
            ret = new Array();
            if (!node || !node.incoming_edges) {
                return ret;
            }
            for (var idx in node.incoming_edges) {
                // XXX: traversal by dottedpath
                var edge = this.context.children[node.incoming_edges[idx]];
                ret.push(edge)
            }
            return ret;
        },
        
        // return array of outgoing edges for given node
        outgoing: function(node) {
            ret = new Array();
            if (!node || !node.outgoing_edges) {
                return ret;
            }
            for (var idx in node.outgoing_edges) {
                // XXX: traversal by dottedpath
                var edge = this.context.children[node.outgoing_edges[idx]];
                ret.push(edge)
            }
            return ret;
        },
        
        // return source node for given edge
        source: function(edge) {
            if (!edge || !edge.source) {
                return;
            }
            // XXX: traversal by dottedpath
            return this.context.children[edge.source];
        },
        
        // return target node for given edge
        target: function(edge) {
            if (!edge || !edge.target) {
                return;
            }
            // XXX: traversal by dottedpath
            return this.context.children[edge.target];
        }
    });
    
    // activities.ui.Diagram member functions
    $.extend(activities.ui.Diagram.prototype, {
        
        // iterate over elements of diagram and call render function
        render: function() {
            for(var idx in this.elements) {
                this.elements[idx].render();
            }
        },
        
        // add element to this diagram
        add: function(elem) {
            this.elements.push(elem);
        }
        
    });
    
    // activities.ui.Action member functions
    $.extend(activities.ui.Action.prototype, {
        
        // render action
        render: function() {
            var context = this.diagram.context;
            context.save();
            context.translate(this.x, this.y);
            context.fillStyle = this.fillColor;
            if (this.selected) {
                context.strokeStyle = this.borderColor;
                context.lineWidth = this.borderWidth;
                context.strokeRect((this.width / 2) * -1,
                                   (this.height / 2) * -1,
                                   this.width,
                                   this.height);
            }
            context.fillRect((this.width / 2) * -1,
                             (this.height / 2) * -1,
                             this.width,
                             this.height);
            context.fillStyle = '#000';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.font = '12px sans-serif';
            context.fillText(this.label, 0, 0, this.width);
            context.restore();
        }
        
    });
    
    // activities.ui.Decision member functions
    $.extend(activities.ui.Decision.prototype, {
        
        // render decision
        render: function() {
            var context = this.diagram.context;
            context.save();
            context.translate(this.x, this.y);
            context.rotate(45 * Math.PI / 180);
            context.fillStyle = this.fillColor;
            context.strokeStyle = this.borderColor;
            context.lineWidth = this.borderWidth;
            context.strokeRect((this.sideLength / 2) * -1,
                               (this.sideLength / 2) * -1,
                               this.sideLength,
                               this.sideLength);
            context.restore();
        }
        
    });
    
    // extend activities with tests
    $.extend(activities, {
        
        tests: {
            
            // test model
            // supposed to be serialized/deserialized by JSON later
            // server side model > node.ext.uml.activities
            // XXX: incoming_edges and outgoing_edges should be computed on
            //      model init
            model: {
                type: activities.model.types.ACTIVITY,
                children: {
                    start: {
                        type: activities.model.types.INITIAL,
                        incoming_edges: [],
                        outgoing_edges: ['edge_1']
                    },
                    fork: {
                        type: activities.model.types.FORK,
                        incoming_edges: ['edge_1'],
                        outgoing_edges: ['edge_2', 'edge_3']
                    },
                    join: {
                        type: activities.model.types.JOIN,
                        incoming_edges: ['edge_5', 'edge_7'],
                        outgoing_edges: ['edge_10']
                    },
                    decision: {
                        type: activities.model.types.DECISION,
                        incoming_edges: ['edge_6'],
                        outgoing_edges: ['edge_8', 'edge_9']
                    },
                    merge: {
                        type: activities.model.types.MERGE,
                        incoming_edges: ['edge_9', 'edge_10'],
                        outgoing_edges: ['edge_11']
                    },
                    action_1: {
                        type: activities.model.types.ACTION,
                        incoming_edges: ['edge_2'],
                        outgoing_edges: ['edge_4']
                    },
                    action_2: {
                        type: activities.model.types.ACTION,
                        incoming_edges: ['edge_3'],
                        outgoing_edges: ['edge_5']
                    },
                    action_3: {
                        type: activities.model.types.ACTION,
                        incoming_edges: ['edge_4'],
                        outgoing_edges: ['edge_6', 'edge_7']
                    },
                    flow_end: {
                        type: activities.model.types.FLOW_FINAL,
                        incoming_edges: ['edge_8'],
                        outgoing_edges: []
                    },
                    end: {
                        type: activities.model.types.FINAL,
                        incoming_edges: ['edge_11'],
                        outgoing_edges: []
                    },
                    edge_1: {
                        type: activities.model.types.EDGE,
                        source: 'start',
                        target: 'fork'
                    },
                    edge_2: {
                        type: activities.model.types.EDGE,
                        source: 'fork',
                        target: 'action_1'
                    },
                    edge_3: {
                        type: activities.model.types.EDGE,
                        source: 'fork',
                        target: 'action_2'
                    },
                    edge_4: {
                        type: activities.model.types.EDGE,
                        source: 'action_1',
                        target: 'action_3'
                    },
                    edge_5: {
                        type: activities.model.types.EDGE,
                        source: 'action_2',
                        target: 'join'
                    },
                    edge_6: {
                        type: activities.model.types.EDGE,
                        source: 'action_3',
                        target: 'decision'
                    },
                    edge_7: {
                        type: activities.model.types.EDGE,
                        source: 'action_3',
                        target: 'join'
                    },
                    edge_8: {
                        type: activities.model.types.EDGE,
                        source: 'decision',
                        target: 'flow_end'
                    },
                    edge_9: {
                        type: activities.model.types.EDGE,
                        source: 'decision',
                        target: 'merge'
                    },
                    edge_10: {
                        type: activities.model.types.EDGE,
                        source: 'join',
                        target: 'merge'
                    },
                    edge_11: {
                        type: activities.model.types.EDGE,
                        source: 'merge',
                        target: 'end'
                    }
                }
            }, // model
            
            run: function() {
                var model = new activities.model.Model(activities.tests.model);
                
                module("activities.model.Model");
                
                test("activities.model.Model.filtered", function() {
                    equals(11,
                           model.filtered(activities.model.types.EDGE).length,
                           "model.filtered(activities.model.types.EDGE)");
                    equals(3,
                           model.filtered(activities.model.types.ACTION).length,
                           "filtered(activities.model.types.ACTION)");
                    var res = model.filtered(
                        activities.model.types.EDGE,
                        activities.tests.model.children.action_1);
                    equals(0,
                           res,
                           "filtered(activities.model.types.ACTION, " +
                           "activities.tests.model.children.action_1)");
                });
                
                test("activities.model.Model.incoming", function() {
                    var res = model.incoming(model.context.children.decision);
                    equals(1,
                           res.length,
                           "model.incoming(model.context.children.decision)");
                    res = model.incoming(model.context.children.merge);
                    equals(2,
                           res.length,
                           "model.incoming(model.context.children.merge)");
                    equals(false,
                           !res[0].source || !res[0].target,
                           "res[0].source && res[0].target");
                });
                
                test("activities.model.Model.outgoing", function() {
                    var res = model.outgoing(model.context.children.decision);
                    equals(2,
                           res.length,
                           "model.outgoing(model.context.children.decision)");
                    res = model.outgoing(model.context.children.merge);
                    equals(1,
                           res.length,
                           "model.outgoing(model.context.children.merge)");
                    equals(false,
                           !res[0].source || !res[0].target,
                           "res[0].source && res[0].target");
                });
                
                test("activities.model.Model.source", function() {
                    var source = model.source(model.context.children.edge_1);
                    equals(true,
                           source.type == activities.model.types.INITIAL,
                           "source.type == activities.model.types.INITIAL");
                });
                
                test("activities.model.Model.target", function() {
                    var target = model.target(model.context.children.edge_1);
                    equals(true,
                           target.type == activities.model.types.FORK,
                           "target.type == activities.model.types.FORK");
                });
            }
        } // tests
    });

})(jQuery);