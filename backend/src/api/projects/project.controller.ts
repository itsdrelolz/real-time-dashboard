import { Request, Response } from "express"; 
import type { Projects } from "@/types/project.types"
import { supabase }  from "../supabaseServer";
export async function getProjects(jwt: string): Promise<Projects | null> { 
    
    const { 
	data: { user: authUser }, 
	error, 
    } = await supabase.auth.getSession
    
}
