#!/usr/bin/js
var fs = require('fs');
fs.readFile(process.argv[2],'utf-8',function(err,data){
        var wordlist = new Array();
        var lines = data.split('\n');
        var words;
        var myre = /(\w+)/g;
        var mybool,myindex;
        function binarySearch(value,arr,startIndex,endIndex) {
            if(!value|| !(arr instanceof Array)){
                return;
            }
            var len    = arr.length,

            startIndex = typeof startIndex === "number" ? startIndex : 0,
            endIndex   = typeof endIndex   === "number" ? endIndex   : len-1,
            midIndex   = Math.floor((startIndex + endIndex) / 2),

            midval     = arr[midIndex];
            if(startIndex > endIndex) {
                mybool = false;
                return startIndex;
            }
            if(midval === value){
                mybool = true;
                return midIndex;
            }else if (midval > value) {
                return binarySearch(value, arr, startIndex, midIndex - 1);
            }else {
                return binarySearch(value, arr, midIndex + 1, endIndex);
            }
        }
        for(var i in lines){
//            console.log(i); 
            words = lines[i].match(myre);
            for(var j in words){
                myindex = binarySearch(words[j].toLowerCase(),wordlist);
                if(!mybool && !/(\d+)$/.test(words[j])){
                    wordlist.splice(myindex,0,words[j].toLowerCase());
                }
//                if(binarySearch(words[j].toLowerCase(),wordlist) === null){
//                    wordlist.push(words[j].toLowerCase());
//                }
            }
        }
        for ( i in wordlist){
            console.log(wordlist[i]);
        }
    });
