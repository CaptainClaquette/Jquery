(function ($)
{
    $.fn.SPmeter = function (options)
    {
        var defauts =
                {
                    "weakColor": "red",
                    "mediumColor": "orange",
                    "strongColor": "green",
                    "minsizeRule": {"size":6, "score":1},
                    "optimalsizeRule": {"size":8, "score":2},
                    "majRule": {"exp":".*[A-Z].*","score":2},
                    "specialRule": {"exp":".*[_:.,=].*","score": 2},
                    "numberRule": {"exp":".*[0-9].*", "score":2}
                };
        //On fusionne nos deux objets ! =D
        var parametres = $.extend(defauts, options);
        return this.each(function ()
        {
            var that = $(this);
            makeMeter(that);
            var timer = null;
            $(this).on("keypress", function (e) {
                var score = 0;

                var target = $(".meter-jauge-" + $(this).attr("data-meterId"));
                clearTimeout(timer);
                timer = setTimeout(function () {
                    var pwd = that.val();
                    score = calculeScore(pwd, parametres);
                    console.log(target);
                    console.log(score);
                    if (score > 0) {
                        if (score < 4)
                        {
                            target.css("background-color", parametres["weakColor"]);
                            target.css("text-align", "center");
                            if (parseInt(target.css("width").replace("px", "")) <= 0) {
                                target.html("<span>faible</span>");
                                var cwidth = (-parseInt(target.css("width").replace("px", "")) + parseInt(target.parents().css("width").replace("px", "") * 0.33));
                                target.animate({
                                    width: "+=" + cwidth
                                }, 200);
                            }
                            else {
                                var cwidth = (parseInt(target.css("width").replace("px", "")) - parseInt(target.parents().css("width").replace("px", "") * 0.33));
                                target.animate({
                                    width: "-=" + cwidth
                                }, 200);
                            }
                        }
                        if (score >= 4 && score <= 7)
                        {
                            target.css("background-color", parametres["mediumColor"]);
                            target.html("<span>moyen</span>");
                            if (parseInt(target.css("width").replace("px", "")) < 100) {
                                var cwidth = (-parseInt(target.css("width").replace("px", "")) + parseInt(target.parents().css("width").replace("px", "") * 0.66));
                                target.animate({
                                    width: "+=" + cwidth
                                }, 200);
                            } else {
                                var cwidth = (parseInt(target.css("width").replace("px", "")) - parseInt(target.parents().css("width").replace("px", "") * 0.66));
                                target.animate({
                                    width: "-=" + cwidth
                                }, 200);
                            }
                        }
                        if (score > 7) {
                            target.html("<span>fort</span>");
                            target.css("background-color", parametres["strongColor"]);
                            if (parseInt(target.css("width").replace("px", "")) < parseInt(target.parents().css("width").replace("px", ""))) {
                                var cwidth = (-parseInt(target.css("width").replace("px", "")) + parseInt(target.parents().css("width").replace("px", "")));
                                target.animate({
                                    width: "+=" + cwidth
                                }, 200);
                            }
                        }
                    } else {
                        target.html("");
                        target.animate({
                            width: "-=" + parseInt(target.css("width").replace("px", ""))
                        }, 200);
                    }
                }, 100);
//                
            });
        });
    };
})(jQuery);

function hasRightSize(string)
{
    return string.length >= 6;
}

function makeMeter(that)
{
    var meterId = that.attr("data-meterId") ? that.attr("data-meterId") : null;
    if (meterId !== null) {
        $("body").append("<div class='meterContainer'></div>");
        var container = $(".meterContainer:last");
        container.append("<div class='meter-jauge-" + meterId + "'></div>");
        container.css("position", "absolute");
        container.css("left", that.position().left + that.width() + 25 + "px");
        container.css("top", that.position().top + "px");
    }
}



function calculeScore(pwd, parametres)
{
    var hasMaj = new RegExp(parametres["majRule"]["exp"], "g");
    var hasSpecial = new RegExp(parametres["specialRule"]["exp"], "g");
    // Must have either capitals and lowercase letters or lowercase and numbers
    var hasNumber = new RegExp(parametres["numberRule"]["exp"], "g");
    var minsize = parametres["minsizeRule"]["size"];
    var optimalsize = parametres["optimalsizeRule"]["size"];
    var score = 0;
    if (pwd.length < minsize) {
        score -= 10;
    } else {
        if (pwd.length >= minsize && pwd.length < optimalsize) {
            score += parametres["minsizeRule"]["score"];
        } else if (pwd.length >= optimalsize) {
            score += parametres["optimalsizeRule"]["score"];
        }
        if (hasNumber.test(pwd)) {
            score += parametres["numberRule"]["score"];
        }
        if (pwd.match(parametres["majRule"]["exp"])) {
            score += parametres["majRule"]["score"];
        }
        if (hasSpecial.test(pwd)) {
            score += parametres["specialRule"]["score"];
        }
    }
    console.log(pwd + " : " + score);

    return score;
}