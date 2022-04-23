

    function getClassesAttended(allClasses, className){
    var numClassesAttended = 0;
    for (var i = 0; i < allClasses.length; i++) {
      if (allClasses[i].className == className) {
        numClassesAttended = numClassesAttended + 1
      }else{
        numClassesAttend = 0;
      }
    }
  
    return numClassesAttended;
  }
module.exports.getClassesAttended = getClassesAttended;
