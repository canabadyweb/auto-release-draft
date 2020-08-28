import * as core from '@actions/core'
import * as event from './event'
import * as version from './version'

export async function run(): Promise<void> {
  try {
      const token = core.getInput('repo-token')
      const tag = event.getCreatedTag()

      var releaseUrl = ''

      if ( tag && version.isSemVer(tag) )
      {
          const changelog = await git.getChangesIntroducedByTag(tag)
          releaseUrl = await github.createReleaseDraft(tag, token, changelog)

      }

      core.setOutput('release-url', releaseUrl)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
