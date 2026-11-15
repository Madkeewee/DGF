"use strict";

const objectives = [
  ["R1", "Oil Refinery 1", "#ffb473"], ["R2", "Oil Refinery 2", "#f79b72"],
  ["R3", "Oil Refinery 3", "#e9cd70"], ["R4", "Oil Refinery 4", "#c9da78"],
  ["R5", "Oil Refinery 5", "#e3ace8"], ["R6", "Oil Refinery 6", "#f39cb4"],
  ["H", "Hospital standby", "#a8df9c"], ["M", "Military standby", "#ff9991"]
];
const duties = [
  "★ Primary alloy-ball carrier", "★ Backup alloy-ball carrier", "Carrier escort", "Carrier escort"
];
const form = document.querySelector("#roster");
const status = document.querySelector("#planner-status");
const plan = document.querySelector("#plan");
const message = document.querySelector("#plan-text");
const copyStatus = document.querySelector("#copy-status");
const format = new Intl.NumberFormat(undefined, {notation: "compact", maximumFractionDigits: 2});

function addField(parent, title, placeholder) {
  const label = document.createElement("label");
  label.textContent = title;
  const input = document.createElement("input");
  input.type = "text";
  input.required = true;
  input.maxLength = 60;
  input.placeholder = placeholder;
  label.append(input);
  parent.append(label);
  return input;
}

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
  // Pair the strongest remaining player with the weakest to even out combined CP.
  const pairs = objectives.map((_, index) => [
    defenders[index], defenders[defenders.length - 1 - index]
  ]);
  return {pairs, floaters};
}

function card([marker, title, color], lines, summary) {
  const article = document.createElement("article");
  article.style.setProperty("--assignment-color", color);
  const heading = document.createElement("h3");
  const badge = document.createElement("span");
  badge.className = "bgb-marker";
  badge.textContent = marker;
  heading.append(badge, title);
  const detail = document.createElement("p");
  detail.textContent = summary;
  const list = document.createElement("ul");
  lines.forEach((line, index) => {
    const item = document.createElement("li");
    if (marker === "F" && index < 2) item.className = "bgb-carrier";
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
  const {pairs, floaters} = assign(players);
  const label = player => `${player.name} (${format.format(player.cp)} CP)`;
  const floatLines = floaters.map((player, index) => `Floater ${index + 1} · ${label(player)} — ${duties[index]}`);
  const cards = pairs.map((members, index) => {
    const cp = members[0].cp + members[1].cp;
    const timing = index < 6 ? "Hold refinery" : "Stage nearby until it opens";
    return card(objectives[index], members.map(label), `${timing} · ${format.format(cp)} CP`);
  });
  cards.push(card(["F", "Floaters", "#a3d6ff"], floatLines, "Stage near the Rare Earth Factory."));
  document.querySelector("#squads").replaceChildren(...cards);
  message.value = [
    "DGF BGB PLAN · Lower-left start",
    ...pairs.map((members, index) => {
      const [marker, title] = objectives[index];
      return `${marker} | ${title}: ${members.map(label).join(", ")}`;
    }),
    "F | Floaters",
    ...floatLines,
    "Hospital and Military pairs stage nearby and wait for their objectives to open. Floaters stage before alloy spawns. Floaters 3 and 4 escort the active carrier to HQ."
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
