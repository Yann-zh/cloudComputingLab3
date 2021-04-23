<template>
  <baidu-map
      id="map0"
      class="map"
      :center="this.center"
      :zoom="this.zoom"
      :scroll-wheel-zoom="true"
      @ready="handler"
      @click="leftClickMap">

    <h1>单击地图上的任意位置，获取当地的天气与疫情信息吧！</h1>
    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
<!--    <bm-map-type-->
<!--        :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP', 'BMAP_SATELLITE_MAP']"-->
<!--        anchor="BMAP_ANCHOR_TOP_LEFT">-->
<!--    </bm-map-type>-->
    <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
    <p align="center">{{ this.clickPlace }}的天气情况：</p>
    <ul class="localData" draggable="true">
      <li>{{ "纬度:" + this.clickLocation.lat.toString() }}</li>
      <li>{{ "经度:" + this.clickLocation.lng.toString() }}</li>
      <li>{{ "天气:" + this.clickWeather }}</li>
      <li>{{ "风向与风级:" + this.clickWind }}</li>
    </ul>
    <hr>
    <p align="center">{{this.clickPlace.split(" ")[1]}}的最新疫情情况：</p>
    <ul class="localData" draggable="true">
      <li>{{ "累计治愈:" + this.clickCovidData.totalCured }}</li>
      <li>{{ "累计死亡:" + this.clickCovidData.totalDeath }}</li>
      <li>{{ "新增病例:" + this.clickCovidData.totalIncrease }}</li>
      <li>{{ "现有疑似:" + this.clickCovidData.totalDoubtful }}</li>
    </ul>
    <p align="right">数据来源：百度地图、和风天气、阿里健康</p>
  </baidu-map>
</template>

<script>

export default {
  data () {
    return {
      center: {lng: 116.404, lat: 39.915},
      zoom: 1,
      clickLocation: {lng: 116.404, lat: 39.915},
      clickPlace: "中国 北京市 北京 北京",
      clickWeather: "",
      clickWind: "",
      clickCovidData: {
        totalCured: 0,
        totalDeath: 0,
        totalIncrease: 0,
        totalDoubtful: 0
      }
    }
  },
  mounted() {
    console.log("Mounted called. This page has been rendered.\n")
    this.getInformation()
  },
  methods: {
    handler ({BMap, map}) {
      console.log(BMap, map)
      // console.log("Handler called.\n")
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom=15
    },
    leftClickMap(e){
      // console.log('LogInfo Called.')
      this.clickLocation.lng=e.point.lng
      this.clickLocation.lat=e.point.lat
      this.getInformation()
    },
    getInformation(){
      // console.log('LogInfo Called.')
      let that=this

      // 和风天气Api的Url，有城市信息与天气信息的两个url
      const heFengKey = "c53776d02e6243fda9f7faf605eb0089"
      const location = this.clickLocation.lng.toString()+','+this.clickLocation.lat.toString()
      const city_url = "https://geoapi.qweather.com/v2/city/lookup"
      const weather_url = "https://devapi.heweather.net/v7/weather/now"

      // 阿里云新冠肺数据Api的Url
      const covid_url = "https://ncovdata.market.alicloudapi.com/ncov/cityDiseaseInfoWithTrend"
      const aliAppCode="APPCODE 5e9791ba42564b2684e042c337c981de"

      this.$axios.get(weather_url, {params:{location:location, key:heFengKey}}).then(function (response){
        console.log(response)
        that.clickWeather=response.data.now.text
        that.clickWind=response.data.now.windDir + " " +  response.data.now.windScale + "级"
      }).catch(function (error) {
        console.log(error);
      });

      this.$axios.get(city_url, {params:{location:location, key:heFengKey}}).then(function (response){
        console.log(response)
        that.clickPlace=response.data.location[0].country+" "+
            response.data.location[0].adm1+" "+
            response.data.location[0].adm2+" "+response.data.location[0].name
      }).catch(function (error) {
        console.log(error);
      });

      this.$axios.get(covid_url, {headers:{Authorization:aliAppCode}}).then(function (response){
        let i=0;
        let len=response.data.provinceArray.length;
        console.log(response)
        for (; i<len; i++){
          if (response.data.provinceArray[i].childStatistic === that.clickPlace.split(" ")[1]){
            that.clickCovidData.totalCured=response.data.provinceArray[i].totalCured
            that.clickCovidData.totalDeath=response.data.provinceArray[i].totalDeath
            that.clickCovidData.totalIncrease=response.data.provinceArray[i].totalIncrease
            that.clickCovidData.totalDoubtful=response.data.provinceArray[i].totalDoubtful
            break
          }
        }
        if (i===len){
          alert("目前仅提供国内疫情信息!")
          that.clickCovidData.totalCured="N/A"
          that.clickCovidData.totalDeath="N/A"
          that.clickCovidData.totalIncrease="N/A"
          that.clickCovidData.totalDoubtful="N/A"
        }
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
}
</script>

<style>
.map {
  width: 100%;
  height: 398px;
}

.localData{
  font-family: Consolas,serif;
  font-size: small;
  list-style-type: none
}
</style>