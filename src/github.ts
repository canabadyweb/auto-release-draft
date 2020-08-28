import * as github from '@actions/github'
import * as version from './version'
import * as markdown from './markdown'

export async function createReleaseDraft(versionTag: string, repoToken: string, changeLog: string): Promise<string>{

    const octokit = new github.GitHub(repoToken)

    const reponse = await octokit.repos.createRelease({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        tag_name: versionTag,
        name: version.removePrefix(versionTag),
        body: markdown.toUnorderList(changeLog),
        prerelease: version.isPrerelease(versionTag),
        draft: true
    })
  
    if( response.status != 201 )
    {
        throw new Error(`Failed to create the release: ${reponse.status}`)
    }

    core.info(`Create release draft ${response.data.name}`)

    return response.data.html_url
}
