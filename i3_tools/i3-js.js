#!/usr/bin/js
var child_process = require("child_process");
child_process.exec("i3-msg -t get_tree",function(err,stdout,stderr){
        var dataobj = JSON.parse(stdout);

        var filterFactory = function(filterRule){
            return function(myDataObj){
                var myObjList = [];
                if(filterRule(myDataObj)){
                    myObjList.push(myDataObj);
                }
                if(typeof(myDataObj.nodes) !== 'undefined' && myDataObj.nodes.length > 0){
                    for(var i in myDataObj.nodes){
                        myObjList = myObjList.concat(arguments.callee(myDataObj.nodes[i]));
                    }
                }
                return myObjList;
            }
        }

        var childCheck = function(checkRule){
            return function(myDataObj){
                if(checkRule(myDataObj)){
                    return true;
                }
                if(typeof(myDataObj.nodes) !== 'undefined' && myDataObj.nodes.length > 0){
                    for(var i in myDataObj.nodes){
                        if(arguments.callee(myDataObj.nodes[i])){
                            return true;
                        }
                    }
                }
                return false;
            }
        }

        var filterFocus = filterFactory(function(myDataObj){
                return typeof(myDataObj.focused) !== 'undefined' && myDataObj.focused;
            });

        var isChildFocus = childCheck(function(myDataObj){
                return typeof(myDataObj.focused) !== 'undefined' && myDataObj.focused;
            });

        var filterFocusWorkSpace = filterFactory(function(myDataObj){
                return typeof(myDataObj.name)!== 'undefined' && /^\d$/.test(myDataObj.name) && isChildFocus(myDataObj);    
            });

        var getFocusWorkSpace = function(MyDataObj){
            var FocusWorkSpaceList = filterFocusWorkSpace(MyDataObj);
            if(FocusWorkSpaceList.length === 1){
                return FocusWorkSpaceList[0];
            }else{
                return null;
            }
        }

        var isFullscreen = function(MyDataObj){
            return filterFocus(MyDataObj)[0].fullscreen_mode !== 0;
        }


        var layout = function(mylayout){
            var currentWorkSpace = getFocusWorkSpace(dataobj);
            if(isFullscreen(currentWorkSpace)){
                child_process.exec("i3-msg fullscreen");
            }
            if(currentWorkSpace.workspace_layout !== mylayout){
                child_process.exec("i3-msg layout" + mylayout);
            }
        }

        var changeLayout = function(){
            var currentWorkSpace = getFocusWorkSpace(dataobj);
            var nextlayout;
            if(currentWorkSpace.nodes[0].layout === "tabbed"){
                nextlayout = "splith";
            }
            else{
                nextlayout = "tabbed";
            }
            layout(nextlayout);
        }

        var focusNext = function(){
            if(!isFullscreen(dataobj)){
                child_process.exec("i3-msg focus down && i3-msg focus right");
            }
            else{
                child_process.exec("i3-msg fullscreen && i3-msg focus down && i3-msg focus right && i3-msg fullscreen");
            }
        }

        if(process.argv[2] === "splith"||process.argv[2] === "tabbed"){
            layout(process.argv[2]);
        }

        if(process.argv[2] === "fullscreen"){
            if(!isFullscreen(dataobj)){
                child_process.exec("i3-msg fullscreen");
            }
        }

        if(process.argv[2] === "changelayout"){
            changeLayout();
        }
        
        if(process.argv[2] === "focusnext"){
            focusNext();
        }
//        console.log(JSON.stringify(getFocusWorkSpace(dataobj),null,4));
    });
