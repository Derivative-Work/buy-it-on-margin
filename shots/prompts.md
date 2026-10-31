# Still and clip prompts

Every still and clip: model, prompt, seed, settings, kept or rejected. Filled at M3.

## Stills: FLUX.2 [dev]

Model `flux2_dev_fp8mixed.safetensors`, text encoder `mistral_3_small_flux2_fp4_mixed.safetensors`, VAE `flux2-vae.safetensors`; 28 steps, euler, guidance 4.0; ComfyUI, text-to-image (`scripts/stills.py`). Prompt = `shots/prompts/<item>.txt` (subject + the shared style).

| Item | Seed | Size | Output | Seconds | When | Status |
| --- | --- | --- | --- | --- | --- | --- |
| N04 | 1929 | 1664×1248 | `takes/stills/N04/N04_s1929.png` | 72.1 | 2026-10-31T13:29:53-04:00 | pending pick |
| ref_customer | 1929 | 1664×1248 | `takes/stills/ref_customer/ref_customer_s1929.png` | 63.9 | 2026-10-31T13:31:10-04:00 | pending pick |
| ref_customer | 1930 | 1664×1248 | `takes/stills/ref_customer/ref_customer_s1930.png` | 50.1 | 2026-10-31T13:32:01-04:00 | pending pick |
| ref_customer | 1931 | 1664×1248 | `takes/stills/ref_customer/ref_customer_s1931.png` | 50.1 | 2026-10-31T13:32:51-04:00 | pending pick |
| ref_customer | 1932 | 1664×1248 | `takes/stills/ref_customer/ref_customer_s1932.png` | 55.9 | 2026-10-31T13:33:47-04:00 | pending pick |
| ref_machine | 1929 | 1664×1248 | `takes/stills/ref_machine/ref_machine_s1929.png` | 58.3 | 2026-10-31T13:34:46-04:00 | pending pick |
| ref_machine | 1930 | 1664×1248 | `takes/stills/ref_machine/ref_machine_s1930.png` | 56.4 | 2026-10-31T13:35:42-04:00 | pending pick |
