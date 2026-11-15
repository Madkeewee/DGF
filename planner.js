"use strict";

const objectives = [
  "Rare Earth Factory perimeter", "Military Base", "Hospital", "Home-side Refineries"
];
const duties = [
  "Primary alloy-ball carrier", "Backup alloy-ball carrier", "Escort and teleport support", "Escort and teleport support"
];
const form = document.querySelector("#roster");
const status = document.querySelector("#planner-status");
const plan = document.querySelector("#plan");
const message = document.querySelector("#plan-text");
const copyStatus = document.querySelector("#copy-status");
const format = new Intl.NumberFormat(undefined, {notation: "compact", maximumFractionDigits: 2});

function addField(parent, title, placeholder, value = "") {
  const label = document.createElement("label");
  label.textContent = title;
  const input = document.createElement("input");
  input.type = "text";
  input.required = true;
  input.maxLength = 60;
  input.placeholder = placeholder;
  input.value = value;
  label.append(input);
  parent.append(label);
  return input;
}

const targets = objectives.map((name, index) =>
  addField(document.querySelector("#objectives"), `Squad ${index + 1} objective`, name, name));
const rows = Array.from({length: 20}, (_, index) => {
  const row = document.createElement("div");
  row.className = "roster-row";
  document.querySelector("#players").append(row);
  return {
    name: addField(row, `Player ${index + 1} name`, "In-game name"),
    cp: addField(row, "CP", "e.g. 350M")
  };
});

function readPower(input) {
  const match = input.trim().match(/^(\d+|\d{1,3}(?:,\d{3})+)(?:\.(\d+))?\s*([kmbgt])?$/i);
  if (!match) return NaN;
  const [, whole, fraction, suffix] = match;
  const scale = {k: 1e3, m: 1e6, b: 1e9, g: 1e9, t: 1e12};
  const cp = Number(whole.replaceAll(",", "") + (fraction ? "." + fraction : "")) * (scale[suffix?.toLowerCase()] ?? 1);
  return Number.isFinite(cp) && cp > 0 && cp <= 1e12 ? Math.round(cp) || NaN : NaN;
}

function assign(players) {
  const ranked = [...players].sort((a, b) => b.cp - a.cp || a.name.localeCompare(b.name));
  const floaters = ranked.slice(0, 4);
  const defenders = ranked.slice(4);
  const squads = Array.from({length: 4}, () => ({members: [], cp: 0}));
  // Each squad gets one player from each band of four comparable defenders.
  for (let start = 0; start < defenders.length; start += 4) {
    squads.sort((a, b) => a.cp - b.cp);
    defenders.slice(start, start + 4).forEach((player, index) => {
      squads[index].members.push(player);
      squads[index].cp += player.cp;
    });
  }
  squads.sort((a, b) => b.cp - a.cp);
  return {squads, floaters};
}

function card(title, lines, summary) {
  const article = document.createElement("article");
  const heading = document.createElement("h3");
  heading.textContent = title;
  const detail = document.createElement("p");
  detail.textContent = summary;
  const list = document.createElement("ul");
  lines.forEach(line => {
    const item = document.createElement("li");
    item.textContent = line;
    list.append(item);
  });
  article.append(heading, detail, list);
  return article;
}

const open = document.querySelector("#open-bgb");
open.addEventListener("click", () => {
  const panel = document.querySelector("#bgb");
  panel.hidden = !panel.hidden;
  open.setAttribute("aria-expanded", String(!panel.hidden));
});

form.addEventListener("input", () => {
  plan.hidden = true;
  status.textContent = "";
});
form.addEventListener("submit", event => {
  event.preventDefault();
  const names = new Set();
  const locations = targets.map(input => input.value.trim());
  if (locations.some(name => !name)) {
    status.textContent = "Enter a name for each defence objective.";
    return;
  }
  const players = [];
  for (const [index, row] of rows.entries()) {
    const name = row.name.value.trim();
    const cp = readPower(row.cp.value);
    if (!name || names.has(name.toLowerCase()) || !Number.isFinite(cp)) {
      status.textContent = `Player ${index + 1} needs a unique name and positive CP. Example: 350M.`;
      (!name || names.has(name.toLowerCase()) ? row.name : row.cp).focus();
      return;
    }
    names.add(name.toLowerCase());
    players.push({name, cp});
  }
  const {squads, floaters} = assign(players);
  const label = player => `${player.name} (${format.format(player.cp)} CP)`;
  const floatLines = floaters.map((player, index) => `${label(player)} — ${duties[index]}`);
  const cards = squads.map(({members, cp}, index) =>
    card(`Squad ${index + 1} · ${locations[index]}`, members.map(label), `Combined CP ${format.format(cp)}`));
  cards.push(card("Floaters · 4 players", floatLines, "Reinforce as called, then stage at the Factory for alloy."));
  document.querySelector("#squads").replaceChildren(...cards);
  message.value = [
    "DGF BGB PLAN",
    ...squads.map(({members}, index) => `Squad ${index + 1} | ${locations[index]}: ${members.map(label).join(", ")}`),
    "Floaters",
    ...floatLines,
    "Defenders hold assigned objectives. Floaters stage at the Factory a few minutes before alloy spawns, then escort the carrier to HQ. Confirm spawn times in game."
  ].join("\n");
  plan.hidden = false;
  status.textContent = "Assigned all 20 players.";
  copyStatus.textContent = "";
});

document.querySelector("#copy-plan").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(message.value);
    copyStatus.textContent = "Copied. Paste the plan into alliance chat.";
  } catch {
    message.focus();
    message.select();
    copyStatus.textContent = "Plan selected. Use your device’s Copy command.";
  }
});
