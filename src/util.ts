// constant representing the amount of time we need to sleep between cog
// commands or else cog-server and mongoose will bug out and not
// properly update cogs on the UI
export const COMMAND_SLEEP = 25;

export async function sleep(milliseconds?: number): Promise<NodeJS.Timeout> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds || COMMAND_SLEEP);
  });
}

export function validSignal(signal: string): boolean {
  return [
    "SIGABRT",
    "SIGALRM",
    "SIGBUS",
    "SIGCHLD",
    "SIGCONT",
    "SIGFPE",
    "SIGHUP",
    "SIGILL",
    "SIGINT",
    "SIGIO",
    "SIGIOT",
    "SIGKILL",
    "SIGPIPE",
    "SIGPOLL",
    "SIGPROF",
    "SIGPWR",
    "SIGQUIT",
    "SIGSEGV",
    "SIGSTKFLT",
    "SIGSTOP",
    "SIGSYS",
    "SIGTERM",
    "SIGTRAP",
    "SIGTSTP",
    "SIGTTIN",
    "SIGTTOU",
    "SIGUNUSED",
    "SIGURG",
    "SIGUSR1",
    "SIGUSR2",
    "SIGVTALRM",
    "SIGWINCH",
    "SIGXCPU",
    "SIGXFSZ",
    "SIGBREAK",
    "SIGLOST",
    "SIGINFO"
  ].includes(signal);
}
