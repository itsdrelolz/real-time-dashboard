import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'
import router from '@/router'
import * as authService from '@/services/authServices';
import { login } from '@/services/authServices'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userProfile = ref(null)
  const authReady = ref(false)

  const isLoggedIn = computed(() => !!user.value)

  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null
  })

  const signIn = async (email, password) => {
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
      router.push('/')

    } catch (error) {
      console.error('Login Failed: ', error);
      user.value = null;
      userProfile.value = null;
      throw error
    }
  };

  const signUp = async (email, password, displayName) => {
    try {
      await authService.register(email, password, displayName);
      alert('Registration successful! Please check your email or login.');
      router.push('/login');
    } catch(error) {
      console.error('Sign up failed:', error);
    }
  }


  const signOut = async () => {
    await supabase.auth.signOut()
    user.value = null
    userProfile.value = null
    router.push('/login')
  }

  const fetchUser = async () => {
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

  const getProfile = async () => {
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


