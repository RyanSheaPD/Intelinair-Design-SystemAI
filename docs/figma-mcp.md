# Figma MCP — syncing this design system to Figma

This project is set up to work with **Figma MCP** so you can get the design system (or example pages) into Figma.

**Source Figma file:** [Variable Design System (test)](https://www.figma.com/design/0njyFuWX2qzunGeGrKHyHi/Variable-Design-System--test-?m=dev)

**Destination in Figma:** Push captures into this file under the **Test layouts** page (create or use that page so all design-system captures live in one place).

## Which plugin is needed to push designs in

You need one of the following so Cursor can send your design system (HTML/URL) into Figma:

### Option A: html.to.design (recommended for “push URL/HTML to Figma”)

- **What it is:** A Figma plugin that converts HTML/webpages into editable Figma layers and exposes an MCP server so AI tools can push designs into Figma.
- **Install:** [html.to.design](https://www.figma.com/community/plugin/1159123024924461424/html-to-design-import-websites-to-figma-designs-web-html-css) from the Figma Community.
- **MCP setup:** In Figma, run the plugin → open the **MCP** tab → click **“How to configure your AI tool?”** and copy the URL or config. Add that to Cursor’s MCP config (e.g. in `.cursor/mcp.json`). The plugin may give you a local URL (e.g. `http://127.0.0.1:3845/mcp`) — that’s the server Cursor talks to.
- **Tools you get:** `import-url` and `import-html` so you (or the AI) can send a URL or HTML string to Figma. After capture, move the new frame(s) onto the **Test layouts** page in your [Variable Design System (test)](https://www.figma.com/design/0njyFuWX2qzunGeGrKHyHi/Variable-Design-System--test-?m=dev) file.
- **Docs:** [html.to.design MCP setup](https://html.to.design/docs/mcp-tab/) (includes Cursor steps).

### Option B: Figma’s official MCP (code-to-canvas / capture from browser)

- **What it is:** Figma’s own MCP server. It can “send live UI to Figma” (code-to-canvas) when using the **remote** server with certain clients.
- **Ways to connect:**
  - **Desktop server:** Install the [Figma desktop app](https://www.figma.com/downloads) and enable the desktop MCP server (runs locally; may use a port like 3845). Then add that server to Cursor per [Figma’s Cursor setup](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/#cursor).
  - **Remote server:** Use `https://mcp.figma.com/mcp` in Cursor’s MCP config (no plugin needed for connection). Code-to-canvas (push UI from browser to Figma) is supported for Cursor when using the remote server; you may need the [Figma plugin for Cursor](https://cursor.com/en-US/marketplace/figma) from the Cursor marketplace.
- **Docs:** [Figma MCP server guide](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Dev-Mode-MCP-Server), [Figma MCP developer docs](https://developers.figma.com/docs/figma-mcp-server/).

**If your `.cursor/mcp.json` already points to `http://127.0.0.1:3845/mcp`:** That’s a **local** MCP server. It’s usually provided by either (1) the **Figma desktop app** (Figma’s desktop MCP server) or (2) the **html.to.design** plugin when it’s running in Figma. Make sure that app or plugin is open and the MCP tab/server is started so Cursor can push designs in.

## Your MCP config

Figma MCP is configured in **`.cursor/mcp.json`**:

```json
{
  "mcpServers": {
    "figma": {
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

The MCP server runs at **`http://127.0.0.1:3845`**. A Figma plugin or desktop bridge must be running and listening on that port for Cursor (or your editor) to talk to Figma.

## Steps to push the design into Figma (using MCP)

1. **Start the Figma MCP bridge**
   - Open Figma (browser or desktop).
   - Run the Figma plugin or app that provides the MCP at `127.0.0.1:3845` (e.g. “Figma MCP” or “HTML to Design” bridge). Ensure it’s running so the server is active.

2. **Serve the design system locally**
   - From the project root:
     ```bash
     npx serve .
     ```
   - Or use another static server. Note the URL (e.g. `http://localhost:3000`).

3. **Open the design system in the browser**
   - Go to the main demo: `http://localhost:3000/` (or `http://localhost:3000/index.html`).
   - The page already loads `https://mcp.figma.com/mcp/html-to-design/capture.js`, which enables capture/sync with Figma.

4. **Use the MCP to capture into Figma**
   - In **Cursor**: If the Figma MCP exposes tools (e.g. “Capture current page” or “Import from URL”), run them and pass the local URL (e.g. `http://localhost:3000`). When prompted for destination, choose the **Test layouts** page in the Variable Design System (test) file.
   - In **Figma**: Use the plugin connected to the MCP (e.g. “HTML to Design”) and either point it at your local URL or use “Capture from browser” with the design system tab. **Place the resulting frame(s) on the Test layouts page** so everything stays under the design system.

After that, the design system (or the captured page) will appear in your Figma file as editable nodes on **Test layouts**.

## What’s already set up in this repo

- **`index.html`** includes the Figma capture script so the main design system demo is ready to be captured.
- **`design-tokens/tokens.css`** and **`tokens.json`** align with the Figma Variable Design System so tokens stay in sync when you export from Figma and update the repo.
- **`pages/variable-design-system.html`** — mirrors the Figma **Variable Design System (test)** variables (see file link in page header); capture with MCP for parity checks against node `26:571` (or your current frame).
- **`pages/`** (e.g. YP1K Analysis, field card demos) can be captured the same way by opening their URLs (e.g. `http://localhost:3000/pages/yp1k-analysis-2024.html`) and using the MCP/capture flow.

## If the MCP isn’t responding

- Confirm the Figma plugin or bridge is running and that nothing else is using port **3845**.
- Restart the plugin and, if needed, reload Cursor so it reconnects to the MCP server.
- Check Cursor’s MCP status (e.g. in settings or the MCP panel) to see if the `figma` server is connected.
