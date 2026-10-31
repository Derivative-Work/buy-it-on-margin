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
| ref_machine | 1931 | 1664×1248 | `takes/stills/ref_machine/ref_machine_s1931.png` | 50.1 | 2026-10-31T13:36:32-04:00 | pending pick |
| ref_machine | 1932 | 1664×1248 | `takes/stills/ref_machine/ref_machine_s1932.png` | 50.1 | 2026-10-31T13:37:23-04:00 | pending pick |
| N02 | 1929 | 1664×1248 | `takes/stills/N02/N02_s1929.png` | 51.1 | 2026-10-31T13:38:15-04:00 | pending pick |
| N02 | 1930 | 1664×1248 | `takes/stills/N02/N02_s1930.png` | 50.1 | 2026-10-31T13:39:05-04:00 | pending pick |
| N02 | 1931 | 1664×1248 | `takes/stills/N02/N02_s1931.png` | 50.2 | 2026-10-31T13:39:55-04:00 | pending pick |
| N02 | 1932 | 1664×1248 | `takes/stills/N02/N02_s1932.png` | 51.4 | 2026-10-31T13:40:46-04:00 | pending pick |
| N04 | 1930 | 1664×1248 | `takes/stills/N04/N04_s1930.png` | 51.1 | 2026-10-31T13:41:38-04:00 | pending pick |
| N04 | 1931 | 1664×1248 | `takes/stills/N04/N04_s1931.png` | 59.7 | 2026-10-31T13:42:38-04:00 | pending pick |
| N04 | 1932 | 1664×1248 | `takes/stills/N04/N04_s1932.png` | 60.3 | 2026-10-31T13:43:38-04:00 | pending pick |
| N05 | 1929 | 1664×1248 | `takes/stills/N05/N05_s1929.png` | 55.6 | 2026-10-31T13:44:35-04:00 | pending pick |
| N05 | 1930 | 1664×1248 | `takes/stills/N05/N05_s1930.png` | 50.1 | 2026-10-31T13:45:25-04:00 | pending pick |
| N05 | 1931 | 1664×1248 | `takes/stills/N05/N05_s1931.png` | 50.4 | 2026-10-31T13:46:15-04:00 | pending pick |
| N05 | 1932 | 1664×1248 | `takes/stills/N05/N05_s1932.png` | 50.1 | 2026-10-31T13:47:05-04:00 | pending pick |
| N07 | 1929 | 1248×1872 | `takes/stills/N07/N07_s1929.png` | 61.4 | 2026-10-31T13:48:08-04:00 | pending pick |
| N07 | 1930 | 1248×1872 | `takes/stills/N07/N07_s1930.png` | 60.1 | 2026-10-31T13:49:08-04:00 | pending pick |
| N07 | 1931 | 1248×1872 | `takes/stills/N07/N07_s1931.png` | 60.1 | 2026-10-31T13:50:08-04:00 | pending pick |
| N07 | 1932 | 1248×1872 | `takes/stills/N07/N07_s1932.png` | 60.1 | 2026-10-31T13:51:08-04:00 | pending pick |
| N11 | 1929 | 1248×2016 | `takes/stills/N11/N11_s1929.png` | 63.1 | 2026-10-31T13:52:13-04:00 | pending pick |
| N11 | 1930 | 1248×2016 | `takes/stills/N11/N11_s1930.png` | 62.1 | 2026-10-31T13:53:15-04:00 | pending pick |
| N11 | 1931 | 1248×2016 | `takes/stills/N11/N11_s1931.png` | 70.1 | 2026-10-31T13:54:25-04:00 | pending pick |
| N11 | 1932 | 1248×2016 | `takes/stills/N11/N11_s1932.png` | 69.1 | 2026-10-31T13:55:34-04:00 | pending pick |
| N14 | 1929 | 2208×1248 | `takes/stills/N14/N14_s1929.png` | 70.1 | 2026-10-31T13:56:46-04:00 | pending pick |
| N14 | 1930 | 2208×1248 | `takes/stills/N14/N14_s1930.png` | 69.1 | 2026-10-31T13:57:55-04:00 | pending pick |
| N14 | 1931 | 2208×1248 | `takes/stills/N14/N14_s1931.png` | 81.9 | 2026-10-31T13:59:17-04:00 | pending pick |
| N14 | 1932 | 2208×1248 | `takes/stills/N14/N14_s1932.png` | 78.1 | 2026-10-31T14:00:35-04:00 | pending pick |
| N16a | 1929 | 1664×1248 | `takes/stills/N16a/N16a_s1929.png` | 51.3 | 2026-10-31T14:01:27-04:00 | pending pick |
| N16a | 1930 | 1664×1248 | `takes/stills/N16a/N16a_s1930.png` | 50.1 | 2026-10-31T14:02:17-04:00 | pending pick |
| N16a | 1931 | 1664×1248 | `takes/stills/N16a/N16a_s1931.png` | 50.1 | 2026-10-31T14:03:07-04:00 | pending pick |
| N16a | 1932 | 1664×1248 | `takes/stills/N16a/N16a_s1932.png` | 50.1 | 2026-10-31T14:03:57-04:00 | pending pick |
| N16b | 1929 | 1664×1248 | `takes/stills/N16b/N16b_s1929.png` | 51.1 | 2026-10-31T14:04:49-04:00 | pending pick |
| N16b | 1930 | 1664×1248 | `takes/stills/N16b/N16b_s1930.png` | 50.1 | 2026-10-31T14:05:39-04:00 | pending pick |
| N16b | 1931 | 1664×1248 | `takes/stills/N16b/N16b_s1931.png` | 50.1 | 2026-10-31T14:06:29-04:00 | pending pick |
| N16b | 1932 | 1664×1248 | `takes/stills/N16b/N16b_s1932.png` | 50.1 | 2026-10-31T14:07:19-04:00 | pending pick |
| N16c | 1929 | 1664×1248 | `takes/stills/N16c/N16c_s1929.png` | 50.4 | 2026-10-31T14:08:10-04:00 | pending pick |
| N16c | 1930 | 1664×1248 | `takes/stills/N16c/N16c_s1930.png` | 50.1 | 2026-10-31T14:09:00-04:00 | pending pick |
| N16c | 1931 | 1664×1248 | `takes/stills/N16c/N16c_s1931.png` | 50.1 | 2026-10-31T14:09:50-04:00 | pending pick |
| N16c | 1932 | 1664×1248 | `takes/stills/N16c/N16c_s1932.png` | 50.1 | 2026-10-31T14:10:41-04:00 | pending pick |
| N17 | 1929 | 1664×1248 | `takes/stills/N17/N17_s1929.png` | 50.3 | 2026-10-31T14:11:32-04:00 | pending pick |
| N17 | 1930 | 1664×1248 | `takes/stills/N17/N17_s1930.png` | 50.1 | 2026-10-31T14:12:22-04:00 | pending pick |
| N17 | 1931 | 1664×1248 | `takes/stills/N17/N17_s1931.png` | 50.1 | 2026-10-31T14:13:12-04:00 | pending pick |
| N17 | 1932 | 1664×1248 | `takes/stills/N17/N17_s1932.png` | 50.1 | 2026-10-31T14:14:02-04:00 | pending pick |
| N22 | 1929 | 1664×1248 | `takes/stills/N22/N22_s1929.png` | 50.4 | 2026-10-31T14:14:53-04:00 | pending pick |
| N22 | 1930 | 1664×1248 | `takes/stills/N22/N22_s1930.png` | 50.1 | 2026-10-31T14:15:43-04:00 | pending pick |
| N22 | 1931 | 1664×1248 | `takes/stills/N22/N22_s1931.png` | 50.0 | 2026-10-31T14:16:33-04:00 | pending pick |
| N22 | 1932 | 1664×1248 | `takes/stills/N22/N22_s1932.png` | 50.1 | 2026-10-31T14:17:23-04:00 | pending pick |
| N24 | 1929 | 1664×1248 | `takes/stills/N24/N24_s1929.png` | 50.2 | 2026-10-31T14:18:14-04:00 | pending pick |
| N24 | 1930 | 1664×1248 | `takes/stills/N24/N24_s1930.png` | 50.1 | 2026-10-31T14:19:04-04:00 | pending pick |
| N24 | 1931 | 1664×1248 | `takes/stills/N24/N24_s1931.png` | 50.1 | 2026-10-31T14:19:54-04:00 | pending pick |
| N24 | 1932 | 1664×1248 | `takes/stills/N24/N24_s1932.png` | 50.0 | 2026-10-31T14:20:45-04:00 | pending pick |
| N32 | 1929 | 2304×1728 | `takes/stills/N32/N32_s1929.png` | 110.3 | 2026-10-31T14:22:36-04:00 | pending pick |
| N32 | 1930 | 2304×1728 | `takes/stills/N32/N32_s1930.png` | 109.1 | 2026-10-31T14:24:25-04:00 | pending pick |
| N32 | 1931 | 2304×1728 | `takes/stills/N32/N32_s1931.png` | 109.1 | 2026-10-31T14:26:14-04:00 | pending pick |
| N32 | 1932 | 2304×1728 | `takes/stills/N32/N32_s1932.png` | 109.1 | 2026-10-31T14:28:03-04:00 | pending pick |
| kf_C1a | 1929 | 1664×1248 | `takes/stills/kf_C1a/kf_C1a_s1929.png` | 50.1 | 2026-10-31T14:28:54-04:00 | pending pick |
| kf_C1a | 1930 | 1664×1248 | `takes/stills/kf_C1a/kf_C1a_s1930.png` | 50.1 | 2026-10-31T14:29:44-04:00 | pending pick |
| kf_C1a | 1931 | 1664×1248 | `takes/stills/kf_C1a/kf_C1a_s1931.png` | 50.1 | 2026-10-31T14:30:34-04:00 | pending pick |
| kf_C1a | 1932 | 1664×1248 | `takes/stills/kf_C1a/kf_C1a_s1932.png` | 50.1 | 2026-10-31T14:31:24-04:00 | pending pick |
| kf_C1b | 1929 | 1664×1248 | `takes/stills/kf_C1b/kf_C1b_s1929.png` | 50.1 | 2026-10-31T14:32:15-04:00 | pending pick |
| kf_C1b | 1930 | 1664×1248 | `takes/stills/kf_C1b/kf_C1b_s1930.png` | 50.1 | 2026-10-31T14:33:05-04:00 | pending pick |
| kf_C1b | 1931 | 1664×1248 | `takes/stills/kf_C1b/kf_C1b_s1931.png` | 50.1 | 2026-10-31T14:33:55-04:00 | pending pick |
| kf_C1b | 1932 | 1664×1248 | `takes/stills/kf_C1b/kf_C1b_s1932.png` | 50.1 | 2026-10-31T14:34:45-04:00 | pending pick |
| kf_C2 | 1929 | 1664×1248 | `takes/stills/kf_C2/kf_C2_s1929.png` | 50.1 | 2026-10-31T14:35:36-04:00 | pending pick |
| kf_C2 | 1930 | 1664×1248 | `takes/stills/kf_C2/kf_C2_s1930.png` | 50.1 | 2026-10-31T14:36:26-04:00 | pending pick |
| kf_C2 | 1931 | 1664×1248 | `takes/stills/kf_C2/kf_C2_s1931.png` | 50.1 | 2026-10-31T14:37:16-04:00 | pending pick |
| kf_C2 | 1932 | 1664×1248 | `takes/stills/kf_C2/kf_C2_s1932.png` | 50.1 | 2026-10-31T14:38:06-04:00 | pending pick |
| kf_C3 | 1929 | 1664×1248 | `takes/stills/kf_C3/kf_C3_s1929.png` | 50.1 | 2026-10-31T14:38:57-04:00 | pending pick |
| kf_C3 | 1930 | 1664×1248 | `takes/stills/kf_C3/kf_C3_s1930.png` | 50.1 | 2026-10-31T14:39:47-04:00 | pending pick |
| kf_C3 | 1931 | 1664×1248 | `takes/stills/kf_C3/kf_C3_s1931.png` | 50.1 | 2026-10-31T14:40:37-04:00 | pending pick |
| kf_C3 | 1932 | 1664×1248 | `takes/stills/kf_C3/kf_C3_s1932.png` | 50.1 | 2026-10-31T14:41:27-04:00 | pending pick |
| N24_v2 | 1929 | 1664×1248 | `takes/stills/N24/N24_v2_s1929.png` | 50.1 | 2026-10-31T14:42:43-04:00 | pending pick |
| N24_v2 | 1930 | 1664×1248 | `takes/stills/N24/N24_v2_s1930.png` | 50.1 | 2026-10-31T14:43:33-04:00 | pending pick |
| N24_v2 | 1931 | 1664×1248 | `takes/stills/N24/N24_v2_s1931.png` | 50.1 | 2026-10-31T14:44:23-04:00 | pending pick |
| N24_v2 | 1932 | 1664×1248 | `takes/stills/N24/N24_v2_s1932.png` | 50.1 | 2026-10-31T14:45:13-04:00 | pending pick |
| N14_v2 | 1929 | 2208×1248 | `takes/stills/N14/N14_v2_s1929.png` | 70.1 | 2026-10-31T14:46:24-04:00 | pending pick |
| N14_v2 | 1930 | 2208×1248 | `takes/stills/N14/N14_v2_s1930.png` | 70.3 | 2026-10-31T14:47:34-04:00 | pending pick |
| N14_v2 | 1931 | 2208×1248 | `takes/stills/N14/N14_v2_s1931.png` | 70.2 | 2026-10-31T14:48:44-04:00 | pending pick |
| N14_v2 | 1932 | 2208×1248 | `takes/stills/N14/N14_v2_s1932.png` | 70.1 | 2026-10-31T14:49:54-04:00 | pending pick |
