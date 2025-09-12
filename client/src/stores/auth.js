import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'
import router from '@/router'
import * as authService from '@/services/authServices';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userProfile = ref(null)
  const authReady = ref(false)

  const isLoggedIn = computed(() => !!user.value)

  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null
  })

  async function signIn(email, password) {
    try {
      const loginResponse = await authService.login(email, password);

      if (!loginResponse.session?.access_token || !loginResponse.session?.refresh_token) {
        throw new Error("Login response did not include the required tokens.");
      }

      const { error } = await supabase.auth.setSession({
        access_token: loginResponse.session.access_token,
        refresh_token: loginResponse.session.refresh_token,
      });
      if (error) throw error;

      userProfile.value = loginResponse.profile;
      await router.push('/')

    } catch (error) {
      console.error('Login Failed: ', error);
      user.value = null;
      userProfile.value = null;
      throw error
    }
  }


  async function signUp(email, password, displayName) {
    try {
      await authService.register(email, password, displayName);
      alert('Registration successful! Please check your email or login.');
      await router.push('/login');
    } catch(error) {
      console.error('Sign up failed:', error);
    }
  }


  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
    userProfile.value = null
    await router.push('/login')
  }

  async function fetchUser(){
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        user.value = null
      } else {
        user.value = data.user
      }
    } catch(e) {
      console.error(e)
    } finally {
      authReady.value = true
    }
  }

  async function getProfile() {
    try {
      userProfile.value = await authService.getProfile()
    } catch (error) {
      console.error('Failed to fetch profile: ', error)
      userProfile.value = null
    }
  }


  return {
    user,
    userProfile,
    authReady,
    isLoggedIn,
    signIn,
    signOut,
    signUp,
    fetchUser,
    getProfile,
  }
})





