Hi, Anon. The whole point of this readme is to give a small/easy guideline on how you can get started with coding using your local LLMs. These are setp by step instructions for hosting LLMs using ollama in your machine

1. Install Ollama

If you have linux/unix based system
```
curl -fsSL https://ollama.com/install.sh | sh
```
This installs the binary and sets it up as a background service (systemd).

If you have macOS, then
```
brew install ollama
```
(or download the .dmg from https://ollama.com/download and drag it into Applications)

If you have windows, then
```
winget install Ollama.Ollama
```
(or grab the installer from https://ollama.com/download/windows and run it)


2. Check that it's running

On linux:
```
systemctl status ollama
```
You should see "active (running)". If not: ```sudo systemctl start ollama```

On macOS/Windows, Ollama runs in the background automatically after install (look for its icon in the menu bar on Mac, or the system tray on Windows). To confirm it's actually working, just run:
```
ollama list
```
If that returns without an error, you're good


3. Pull a small test model and watch the logs while it loads:
Heads up, this model is about 9 GB, so make sure you've got the disk space free before pulling
```
ollama pull qwen2.5-coder:14b
```
To test, run:
```
ollama run qwen2.5-coder:14b "write a hello world in python"
```

Note: having a GPU with enough VRAM to fit the model makes this a lot faster. If you don't have enough VRAM, Ollama will fall back to running partly or fully on CPU, which still works, just slower

4. Use it
```
ollama run qwen2.5-coder:14b
```
This drops you into a chat prompt right in the terminal. Type your question, get your answer, Ctrl+D or /bye to exit. 

5. Connect it to coding agent
Ollama exposes an OpenAI-compatible API at http://localhost:11434. We shall use this in the codesmith coding agent