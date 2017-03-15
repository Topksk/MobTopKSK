function openAndCloseMenu(){
    if($(".page").css("left") == "0px" && config.authorized)
    {
        $(".page").animate({"left": "250px"});
        $("div.header").animate({"left": "250px"});
        //$(".slideMenu").show();
        //alert("z-index, slideMenu=" + $(".slideMenu").css("z-index") + ", page=" + $(".page").css("z-index"));
    }
    else
    {
        $(".page").animate({"left": "0px"});
        $("div.header").animate({"left": "0px"});
        config.pbtn=1;
        //$(".slideMenu").hide();
    }
}

$(document).hammer({domEvents:true}).on("tap", ".menuBtn", function(){
    openAndCloseMenu();    
});

$(document).hammer({domEvents:true}).on("tap", "ul.menuList li", function() {
    if($(this).attr("link") != null)
    {
        document.location.hash = $(this).attr("link");
    }
    openAndCloseMenu();
});

$(document).hammer({domEvents:true}).on("swipeleft",".page", function(){
    if($(".page").css("left") == "250px" && config.authorized)
    {
        $(".page").animate({"left": "0px"});
        $("div.header").animate({"left": "0px"});
    } 
});

$(document).hammer({domEvents:true}).on("swiperight",".page", function(){
    if($(".page").css("left") == "0px" && config.authorized)
    {
        $(".page").animate({"left": "250px"});
        $("div.header").animate({"left": "250px"});
    }  
});

$(document).hammer({domEvents:true}).on("tap",".page", function(){
    if($(".page").css("left") != "0px")
    {
        $(".page").animate({"left": "0px"});
        $("div.header").animate({"left": "0px"});
    }
});