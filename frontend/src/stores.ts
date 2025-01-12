import { browser } from '$app/env'
import { writable } from 'svelte/store'
import type { UserWorkspaceList } from './gen'
import { getUserExt } from './utils'

export interface UserExt {
	email: string
	username: string
	is_admin: boolean
	created_at: string
	groups: string[]
	pgroups: string[]
}

let persistedWorkspace = browser && localStorage.getItem('workspace')

export const userStore = writable<UserExt | undefined>(undefined)
export const workspaceStore = writable<string | undefined>(
	persistedWorkspace ? String(persistedWorkspace) : undefined
)
export const usersWorkspaceStore = writable<UserWorkspaceList | undefined>(undefined)
export const superadmin = writable<String | false | undefined>(undefined)
export const hubScripts = writable<Array<{
	path: string
	summary: string
	approved: boolean
}> | undefined>(undefined)

if (browser) {
	workspaceStore.subscribe(async (workspace) => {
		if (workspace) {
			localStorage.setItem('workspace', String(workspace))
			userStore.set(await getUserExt(workspace))
		} else {
			userStore.set(undefined)
		}
	})

}

export function clearStores(): void {
	userStore.set(undefined)
	workspaceStore.set(undefined)
	usersWorkspaceStore.set(undefined)
	superadmin.set(undefined)
}
