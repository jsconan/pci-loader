<script lang="ts">
    import packageInfo from 'root/package.json';

    const repositoryUrl = packageInfo.repository.url.replace(/((^git\+)|(\.git$))/g, '');
</script>

<menu>
    <a href={repositoryUrl} target="_blank" class="github" title="GitHub Repository"><span>GitHub</span></a>
</menu>

<style>
    menu {
        margin: 0;
        padding: 0;
    }

    a {
        display: inline-block;
        padding: 0.6em 1.2em 0.6em 3.2em;
    }
    a::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0.8em;
        transform: translateY(-50%);
        width: 1.6em;
        height: 1.6em;
        background: url('/github-black.svg') no-repeat center/contain;
    }

    @media (prefers-color-scheme: dark) {
        a::before {
            background: url('/github-white.svg') no-repeat center/contain;
        }
    }

    @media (max-width: 900px) {
        a {
            padding: 0;
            width: 2em;
            height: 2em;
        }
        a::before {
            left: 0;
            width: 2em;
            height: 2em;
        }
        span {
            display: none;
        }
    }
</style>
