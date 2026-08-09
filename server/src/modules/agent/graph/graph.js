const { StateGraph, START, END } = require("@langchain/langgraph");
const { shortlistNode } = require("./nodes/shortlist.node");
const AgentState = require("./state");
const { menuNode } = require("./nodes/menu.node");
const { intentNode } = require("./nodes/intent.node");
const { discoveryNode } = require("./nodes/discovery.node");
const { reviewNode } = require("./nodes/review.node");
const {
recommendationNode,
} = require("./nodes/recommendation.node");
const { finalNode } = require("./nodes/final.node");


const researchGraph = new StateGraph(AgentState)
  .addNode("intent", intentNode)
  .addNode("discovery", discoveryNode)
  .addNode("shortlist", shortlistNode)
  .addNode("menu", menuNode)
  .addNode("review", reviewNode)
  .addNode("recommendation", recommendationNode)
  .addNode("final", finalNode)

  .addEdge(START, "intent")
  .addEdge("intent", "discovery")
  .addEdge("discovery", "shortlist")
  .addEdge("shortlist", "menu")
  .addEdge("menu", "review")
  .addEdge("review", "recommendation")
  .addEdge("recommendation", "final")
  .addEdge("final", END);
const agentGraph = researchGraph.compile();

module.exports = agentGraph;