RiskCityApp.factory('MarkerService',[function(){
  console.log("MarkerService running!!")
  return {
    checkHoods: function() {
      var allHoods = ["Admiral","Alki","Arbor Heights","Atlantic","Ballard","Beacon Hill","Belltown","Bitter Lake","Blue Ridge","Brighton","Broadmoor","Broadview","Bryant","Capitol Hill","Cedar Park","Central District","Columbia City","Crown Hill","Denny Blaine","Downtown","Eastlake","Fauntleroy","First Hill","Fremont","Georgetown","Green Lake","Greenwood","Haller Lake","Hawthorne Hills","High Point","Highland Park","Industrial District","Interbay","International District","Laurelhurst","Leschi","Lower Queen Anne","Loyal Heights","Madison Park","Madison Valley","Madrona","Magnolia","Maple Leaf","Matthews Beach","Meadowbrook","Montlake","Mount Baker","North Beach","North College Park","North Delridge","Northgate","Olympic Hills","Olympic Manor","Phinney Ridge","Pinehurst","Pioneer Square","Portage Bay","Queen Anne","Rainier Beach","Ravenna","Riverview","Roosevelt","Roxhill","Sand Point","Seward Park","South Delridge","South Lake Union","South Park","Sunset Hill","University District","Victory Heights","View Ridge","Wallingford","Wedgwood","West Seattle","Westlake","Whittier Heights","Windermere"]
      console.log("length: ", allHoods.length)
    },
    //name generator
    getName: function(){
      $.ajax({
        url: 'http://api.randomuser.me/',
        dataType: 'json',
        success: function(data){
        // console.log(data.results[0].user.name.first);
        name = data.results[0].user.name.first;
        first = name[0].toUpperCase();
        firstName = first.concat(name.slice(1));
        console.log(firstName)
        return firstName
        }
      });
    }
  }
}]);

