var oldMouseHoverYear = -1;

function initBubble()
{
    let bubble = document.getElementById('bubble');
    let bubbleWrapper = document.getElementById('bubble-wrapper');

    let content = document.createElement("DIV");
    content.id = 'yearBubbleContent';
    bubble.appendChild(content);

    let tipContainer = document.createElement("DIV")
    tipContainer.className = "tip-container";
    bubbleWrapper.appendChild(tipContainer);

    let tip = document.createElement("DIV")
    tip.className = "tip";
    tip.id = "tip";
    tipContainer.appendChild(tip);

    timeline.addEventListener('mousemove', moveBubble);
    timeline.addEventListener('mouseover', show);
    timeline.addEventListener('mouseout', hide);

}

var show = function(e)
{
    let bubbleWrapper = document.getElementById('bubble-wrapper');
    let bubble = document.getElementById('bubble');
    let bubbleTip = document.getElementById('tip');
    bubbleWrapper.style.left = e.clientX-(bubbleWrapper.offsetWidth/2)+'px';

    bubble.style.opacity = '1';
    bubbleTip.style.opacity = '1';
}

var hide = function()
{
  let bubbleWrapper = document.getElementById('bubble-wrapper');
  let bubble = document.getElementById('bubble');
  let bubbleTip = document.getElementById('tip');

  bubble.style.opacity = '0';
  bubbleTip.style.opacity = '0';
}

var moveBubble = function(e)
{
  let bubbleWrapper = document.getElementById('bubble-wrapper');

  let mouseHoverYear = (((e.clientX - 64)/(window.innerWidth-85))*(mapPeriod[1]-mapPeriod[0])) + mapPeriod[0];
  mouseHoverYear = Math.round(mouseHoverYear);

  if (mouseHoverYear!=oldMouseHoverYear) {
      if(mouseHoverYear >= mapPeriod[0] && mouseHoverYear <= mapPeriod[1])
      {
          bubbleWrapper.style.left = (16+(mouseHoverYear-mapPeriod[0])*(window.innerWidth-85)/(mapPeriod[1]-mapPeriod[0]))+'px';

          var sliderVal = mapYear;
          document.getElementById('yearBubbleContent').innerHTML = "<p>"+mouseHoverYear+" AD</p>";
          oldMouseHoverYear = mouseHoverYear;
      }
  }
}

function createTimelineEvent(year,name) {
  let a = document.createElement("DIV");
  a.className = 'timeline-event-wrapper';
  a.id = name;
  a.style.left = (100*(year-mapPeriod[0])/(mapPeriod[1]-mapPeriod[0]))+'%';
  a.addEventListener('mouseenter',openTimelinePopup);
  a.addEventListener('mouseleave',removeTimelinePopup);
  a.addEventListener('click',moveToEvent);
  document.getElementById('timeline-wrapper').appendChild(a);

  let b = document.createElement("DIV");
  b.className = 'timeline-event';
  a.appendChild(b);
}

function removeTimelinePopup() {
  let tPCO = document.getElementById('timelinePopupCurrentlyOpen')
  if (tPCO){
    tPCO.remove();
  }
}

function hoverTimelineEvent(e) {
  openTimelinePopup(e)
}

function moveToEvent(e) {
  let windowPUp = document.getElementsByClassName('leaflet-popup-content')[0];
  if (!(windowPUp && windowPUp.firstChild.id==this.id)){
    let dest = findAgent(this.id);
    document.getElementById('slide').value = dest.profile.yearRange[0];
    updateYear();
    removeTimelinePopup();
    dest.marker.openPopup();
  }
}
function openTimelinePopup(e) {

  currentPopupFrame = document.createElement('iframe');
  currentPopupFrame.id = e.target.id;
  currentPopupName = currentPopupFrame.id;
  currentPopup = findAgent(currentPopupName);
  currentPopupFrame.src="./agents/agent.html"

  let contentWrapper = document.createElement('DIV');
  contentWrapper.className = 'timeline-popup-content-wrapper';
  contentWrapper.appendChild(currentPopupFrame);

  let popen = document.createElement('div');
  popen.id = 'timelinePopupCurrentlyOpen';
  popen.className = 'timeline-popup';
  popen.appendChild(contentWrapper);


  let tipContainer = document.createElement("DIV")
  tipContainer.className = "tip-container";
  tipContainer.style.position = 'absolute';
  tipContainer.style.bottom = '-30px';
  tipContainer.style.marginLeft = '134px';
  popen.appendChild(tipContainer);

  let tip = document.createElement("DIV")
  tip.className = "tip";
  tip.id = "tip";
  tip.style.opacity = 1;
  tipContainer.appendChild(tip);

  e.currentTarget.appendChild(popen);
  let overhang = (popen.getBoundingClientRect().left + popen.getBoundingClientRect().width - window.innerWidth);
  if (overhang > 0) {
    popen.style.left = (-170-overhang)+'px';
    tipContainer.style.marginLeft = (154+overhang)+'px';
  }
}
