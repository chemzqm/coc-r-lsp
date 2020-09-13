import winreg from "winreg"
import { WorkspaceConfiguration } from 'coc.nvim'
import { existsSync } from "fs"

export async function getRPath(config: WorkspaceConfiguration) {
  let path = config.get<string>("lsp.path")
  if (path && existsSync(path)) {
    return path
  }

  if (process.platform === "win32") {
    try {
      const key = new winreg({
        hive: winreg.HKLM,
        key: '\\Software\\R-Core\\R'
      })
      const item: winreg.RegistryItem = await new Promise((c, e) =>
        key.get('InstallPath', (err, result) => err ? e(err) : c(result)))

      const rhome = item.value
      console.log("found R in registry:", rhome)

      path = rhome + "\\bin\\R.exe"
    } catch (e) {
      path = ''
    }
    if (path && existsSync(path)) {
      return path
    }
  }

  return "R"
}
