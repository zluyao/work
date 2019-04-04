import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      mainMenu:[],
      childMenu:[]
  },
  mutations: {
      changeChildMenu(state, menuList){
          state.childMenu = menuList
      },
      changeMainMenu(state, mainMenuList){
          state.mainMenu = mainMenuList
      }
  },
  actions: {

  }
})
