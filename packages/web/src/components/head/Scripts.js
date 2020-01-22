/* eslint-disable no-console,react/no-danger */
import React from 'react';

import { AMPLITUDE_KEY, FACEBOOK_KEY, GTM_KEY } from 'shared/constants';

import Gtag from 'components/head/Gtag';

const initGtmScript = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_KEY}');`;

const initAmplitudeScript = `
(function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script")
;r.type="text/javascript"
;r.integrity="sha384-vYYnQ3LPdp/RkQjoKBTGSq0X5F73gXU3G2QopHaIfna0Ct1JRWzwrmEz115NzOta"
;r.crossOrigin="anonymous";r.async=true
;r.src="https://cdn.amplitude.com/libs/amplitude-5.8.0-min.gz.js"
;r.onload=function(){if(!e.amplitude.runQueuedFunctions){
console.log("[Amplitude] Error: could not load SDK")}}
;var i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)
;function s(e,t){e.prototype[t]=function(){
this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}
var o=function(){this._q=[];return this}
;var a=["add","append","clearAll","prepend","set","setOnce","unset"]
;for(var u=0;u<a.length;u++){s(o,a[u])}n.Identify=o;var c=function(){this._q=[]
;return this}
;var l=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"]
;for(var p=0;p<l.length;p++){s(c,l[p])}n.Revenue=c
;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId", "enableTracking", "setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","groupIdentify","onInit","logEventWithTimestamp","logEventWithGroups","setSessionId","resetSessionId"]
;function v(e){function t(t){e[t]=function(){
e._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}}
for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){
e=(!e||e.length===0?"$default_instance":e).toLowerCase()
;if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};v(n._iq[e])}return n._iq[e]}
;e.amplitude=n})(window,document);
amplitude.getInstance().init("${AMPLITUDE_KEY}");`;

const initFacebookScript = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window,document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FACEBOOK_KEY}');
fbq('track', 'PageView');`;

export default function Scripts() {
  const scripts = [
    <script async defer src="https://platform.twitter.com/widgets.js" />,
    <script async defer src="https://platform.instagram.com/en_US/embeds.js" />,
    <Gtag />,
  ];

  if (GTM_KEY) {
    scripts.push(
      <script
        dangerouslySetInnerHTML={{
          __html: initGtmScript,
        }}
      />
    );
  } else if (process.env.NODE_ENV === 'production') {
    console.warn(`WEB_GTM_KEY doesn't set in environment`);
  }

  if (AMPLITUDE_KEY) {
    scripts.push(
      <script
        dangerouslySetInnerHTML={{
          __html: initAmplitudeScript,
        }}
      />
    );
  } else if (process.env.NODE_ENV === 'production') {
    console.warn(`WEB_AMPLITUDE_KEY doesn't set in environment`);
  }

  if (FACEBOOK_KEY) {
    scripts.push(
      <script
        dangerouslySetInnerHTML={{
          __html: initFacebookScript,
        }}
      />
    );
  } else if (process.env.NODE_ENV === 'production') {
    console.warn(`WEB_FACEBOOK_KEY doesn't set in environment`);
  }

  return scripts;
}
