import { exec } from '@actions/exec'

export async function getChangesIntroducedByTag(tag: string): Promise<string> {
    const previousVersionTag = await getPerviousVersionTag(tag)

    return previousVersionTag ? getCommitMessagesBetween(previousVersionTag, tag) : getCommitMessagesFrom(tag)
}

export async function getPerviousVersionTag(tag: string): Promise<string | null>{

    let previousTag = ''

    const options: ExecOptions = {
        listeners: {
            stdout: ( data: Buffer ) => {
                previousTag += data.toString()
            }
        },
        silent: true,
        ignoreReturnCode: true
    }

    const exitCode = await exec(
        'git',
        [ 'describe',
            '--match', 'v[0-9]*',
            '--abbrev=0',
            '--first-parent',
            `${tag}^` ],
        options )

    core.debug('The previous version tag is ${previousTag}')

    return exitCode === 0 ? previousTag.trim() : null
}

export async function getCommitMessagesBetween( firstTag: string, secondTag: string ): Promise<string>{
    let commitMessages = ''

    const options: ExecOptions = {
        listeners : {
            stdout: (data: buffer) => {
                commitMessages += data.toString()
            }
        },
        silent: true
    }

    await exec(
        'git',
        [
            'log',
            '--format=%s',
            `${firstTag}..${secondTag}` ],
        options)

    core.debug(`The commit messages between ${firstTag} and ${secondTag} is ${commitMessages}`)

    return commitMessages.trim();
}

export async function getCommitMessagesFrom(tag: string): Promise<string> {
    let commitMessages = '';

    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                commitMessages += data.toString();
            }
        },
        silent: true
    };

    await exec(
        'git',
        [
            'log',
            'format=%s',
            tag],
        options);

    core.debug(`The commit messages from ${tag} are:\n ${commitMessages}`)

    return commitMessages.trim();
}
