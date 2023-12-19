import * as tf from "@tensorflow/tfjs";

tf.env().set("PROD", true);
tf.setBackend("cpu");
