export type Lesson = {
  slug: string;
  title: string;
  blurb: string;
  body: string[];
};

export const LESSONS: Lesson[] = [
  {
    slug: "ai",
    title: "What is AI?",
    blurb: "Systems that perform tasks we associate with intelligence.",
    body: [
      "Artificial intelligence is a broad label for software that maps inputs to useful outputs that used to require a person — perceiving, classifying, ranking, generating language, planning.",
      "This lab focuses on perception AI: turning pixels (and later range/IMU) into symbols a program can act on.",
      "AI is not one model. It is a stack: data, representation, model, inference, evaluation, and the application that consumes the result.",
    ],
  },
  {
    slug: "ml",
    title: "What is ML?",
    blurb: "Learning parameters from data instead of hand-writing every rule.",
    body: [
      "Machine learning fits a function from examples. Instead of writing `if pixel is red and round then apple`, you show labeled images and optimize weights.",
      "Supervised learning (used by detectors) needs labels. Self-supervised learning (used by many VLMs) learns from raw text/images, then is aligned with instructions.",
      "The artifact you ship is usually the weights plus the preprocessing and postprocessing code — not just a Python file.",
    ],
  },
  {
    slug: "dl",
    title: "What is deep learning?",
    blurb: "Neural nets with many layers that learn hierarchical features.",
    body: [
      "Deep learning is ML with neural networks deep enough to learn features: edges → parts → objects in vision; tokens → phrases → semantics in language.",
      "Training uses backpropagation: a loss tells you how wrong the output was; gradients update millions of weights with an optimizer (Adam, SGD).",
      "Inference is the forward pass only. This lab is almost entirely inference — the cheaper, deployable half.",
    ],
  },
  {
    slug: "nn",
    title: "What is a neural network?",
    blurb: "Stacked linear maps and nonlinearities.",
    body: [
      "A layer is roughly `y = activation(Wx + b)`. Stack them and you can approximate very complicated functions.",
      "Convolutional nets slide small filters over images (good for locality). Transformers let every token/patch attend to others (good for long range).",
      "YOLO, MobileNet, ViT and VLMs are all neural nets with different connectivity patterns.",
    ],
  },
  {
    slug: "tensor",
    title: "What is a tensor?",
    blurb: "A typed, shaped multidimensional array — the currency of DL.",
    body: [
      "A 720p RGB frame is a tensor of shape [720, 1280, 3] (H, W, C) or [1, 3, 720, 1280] (N, C, H, W) after batching and channel-first conversion.",
      "Frameworks (PyTorch, TensorFlow) are tensor computers: they run ops on CPU/GPU and track gradients when training.",
      "Shape bugs are the most common production failures. Always print `tensor.shape` when something looks insane.",
    ],
  },
  {
    slug: "pytorch",
    title: "What is PyTorch?",
    blurb: "The dominant research/production framework for Python GPU training.",
    body: [
      "PyTorch represents models as `nn.Module` graphs that run eagerly. You write Python, get GPU kernels.",
      "Typical path: Dataset → DataLoader → tensor → model.forward → loss → backward → optimizer.step.",
      "This website cannot run arbitrary PyTorch on Netlify. Production YOLO/VLM training and GPU serving happen in Python (FastAPI + CUDA) or TensorRT.",
    ],
  },
  {
    slug: "tensorflow",
    title: "What is TensorFlow?",
    blurb: "Google's DL framework; TensorFlow.js is the browser cousin.",
    body: [
      "TensorFlow (Python) and TensorFlow.js (JavaScript) share ideas — tensors, graphs, SavedModel — but a `.h5` Python model does not magically run in Chrome.",
      "You convert/export to TFJS layers or graph format, or use a model already published for TFJS (like COCO-SSD).",
      "Keras is the high-level Python API. TF Serving / TFX appear in large production stacks.",
    ],
  },
  {
    slug: "yolo",
    title: "What is YOLO?",
    blurb: "You Only Look Once — a family of real-time object detectors.",
    body: [
      "Classic two-stage detectors (Faster R-CNN) propose regions then classify. YOLO predicts boxes and classes in one shot, which is why it is fast.",
      "Modern YOLO (v8–v11) is a CNN backbone + neck + detection head, trained with box + class + distribution-focal losses, decoded with NMS.",
      "This lab's live boxes come from COCO-SSD (a different single-shot detector in TFJS). Treat it as the same *task*, not the same *weights*.",
    ],
  },
  {
    slug: "transformer",
    title: "What is a Transformer?",
    blurb: "Attention-based architecture behind GPT, ViT, and most VLMs.",
    body: [
      "Self-attention lets every position mix information with every other position, weighted by learned queries/keys.",
      "Vision Transformers split an image into patches, embed them, and run the same block stack as language models.",
      "Transformers.js / ONNX can run small distilled models in the browser; large VLMs still want a GPU or an API.",
    ],
  },
  {
    slug: "vlm",
    title: "What is a VLM?",
    blurb: "Vision-language models jointly see and speak.",
    body: [
      "A VLM encodes an image (and a prompt) into a shared space, then generates tokens. It can answer `what is happening?` not just `person 0.94`.",
      "VLMs hallucinate. They are not a substitute for a calibrated detector when you need a hard box and a count.",
      "This lab uses a user-initiated VLM call (xAI on the server, or your own Ollama/HF/OpenAI-compatible endpoint). No secret tokens are shipped.",
    ],
  },
  {
    slug: "inference",
    title: "What is inference?",
    blurb: "The forward pass that turns a new input into a prediction.",
    body: [
      "Training updates weights. Inference uses frozen weights. Deployment is mostly inference plus monitoring.",
      "Latency budget = capture + preprocess + infer + postprocess + draw + your application logic.",
      "Batching raises throughput and often latency. Edge cameras usually batch=1.",
    ],
  },
  {
    slug: "gpu",
    title: "What is GPU acceleration?",
    blurb: "Massive data-parallel math, which tensors love.",
    body: [
      "A GPU runs thousands of simple cores. Matmuls and convolutions map well; your Python `for` loop does not.",
      "In the browser, WebGL/WebGPU is the stand-in for CUDA. This lab reports GPU telemetry only when the browser actually exposes it — never as fake percentages.",
      "CUDA, TensorRT, and ONNX Runtime are the usual server/edge stack for YOLO.",
    ],
  },
  {
    slug: "edge",
    title: "What is edge AI?",
    blurb: "Run the model next to the sensor, not only in a region.",
    body: [
      "Edge = Jetson, phone NPU, camera SoC, industrial PC. You trade model size for latency, privacy, and offline operation.",
      "A browser tab on a laptop is a mild form of edge. A robot is a stricter one (power, thermals, determinism).",
      "This product's Mode B is the honest path: browser UI → localhost/GPU FastAPI → PyTorch YOLO.",
    ],
  },
  {
    slug: "serving",
    title: "What is model serving?",
    blurb: "A stable API around load, batch, version, and health of models.",
    body: [
      "A ModelRunner in this codebase is the educational version of a server: `load`, `predict`, `metrics`, `dispose`.",
      "Production adds: model registry, canary versions, autoscaling, auth, tracing (OpenTelemetry), and SLOs.",
      "Never bake API keys into a frontend. Serving should sit behind a gateway.",
    ],
  },
  {
    slug: "fusion",
    title: "What is sensor fusion?",
    blurb: "Combine imperfect sensors into a better state.",
    body: [
      "Camera: rich semantics, poor metric depth. LiDAR: metric geometry, sparse semantics. IMU: motion, drift. GPS: absolute pose, noisy in cities.",
      "Classic fusion: Kalman / factor graphs. Learned fusion: networks that eat several modalities.",
      "The fusion lab in this app is a teaching sketch, not a Kalman filter running on a robot.",
    ],
  },
  {
    slug: "api",
    title: "What is an API?",
    blurb: "A contract: send bytes, get bytes, with auth and SLOs.",
    body: [
      "REST, gRPC, WebSocket, MQTT are transports. The contract is the schema (JSON, protobuf) plus error semantics.",
      "A VLM API typically accepts an image (URL or base64) plus a prompt, and returns tokens.",
      "Bring-your-own-key (BYOK) in a learning UI stores the key in the browser — fine for a demo, unacceptable for production.",
    ],
  },
  {
    slug: "embedding",
    title: "What is an embedding?",
    blurb: "A vector that represents meaning so similar things are nearby.",
    body: [
      "CLIP-style models embed images and text in one space so you can search `red backpack` against camera frames.",
      "Detectors output discrete classes. Embeddings output geometry you can kNN, cluster, or feed to a bigger model.",
      "Dimensionality (256, 768, 3072…) is a systems choice: storage, recall, and hardware.",
    ],
  },
  {
    slug: "attention",
    title: "What is attention?",
    blurb: "A weighted average of values, with weights from queries and keys.",
    body: [
      "Attention is `softmax(QKᵀ / √d) V`. It is not magic; it is a routing mechanism the network learns.",
      "In a VLM, image patches and text tokens attend to each other so `the red object on the left` can bind to pixels.",
      "You can visualize attention, but it is not a faithful explanation by itself.",
    ],
  },
  {
    slug: "quantization",
    title: "What is quantization?",
    blurb: "Store weights in fewer bits so models fit and run faster.",
    body: [
      "FP32 → FP16/BF16 → INT8 → INT4. Each step can hurt accuracy and help FPS/VRAM.",
      "Browser and edge models are almost always quantized. Catalog FPS numbers without the dtype are incomplete.",
      "QAT (quantization-aware training) usually beats naive post-training quantization for detectors.",
    ],
  },
  {
    slug: "latency",
    title: "What is latency?",
    blurb: "Time until this input produces its output.",
    body: [
      "p50 vs p95 vs p99 matter. A mean of 40 ms with a p99 of 400 ms will miss robot control loops.",
      "End-to-end latency ≠ model latency. Capture, resize, NMS, and draw often dominate on the edge.",
      "This lab measures the browser detector when it runs. Everything else is labeled catalog or simulated.",
    ],
  },
  {
    slug: "throughput",
    title: "What is throughput?",
    blurb: "How many inputs you finish per second.",
    body: [
      "FPS is throughput for cameras. Tokens/s is throughput for VLMs. They are not interchangeable.",
      "You can raise throughput with batching and drop latency. Product requirements decide which to optimize.",
      "A people-counter cares about not dropping tracks. A VLM inspector cares about seconds per question.",
    ],
  },
];
