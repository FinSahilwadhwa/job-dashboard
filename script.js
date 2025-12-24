const { createClient } = supabase;

const supabaseClient = createClient(
  "https://unncbeiqbntljutgkvhj.supabase.co",
  "sb_publishable_TaMX2BTySoyAs_eT_LgSSg_HRGeiPxN"
);

// Protect dashboard
(async () => {
  const { data } = await supabaseClient.auth.getUser();
  if (!data.user && location.pathname.includes("dashboard")) {
    window.location.href = "index.html";
  }
  loadJobs();
})();

// Login
async function login() {
  const email = email.value;
  const password = password.value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    document.getElementById("error").innerText = error.message;
  } else {
    window.location.href = "dashboard.html";
  }
}

// Add job
document.getElementById("jobForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const { data } = await supabaseClient.auth.getUser();

  await supabaseClient.from("applications").insert({
    user_id: data.user.id,
    company: company.value,
    role: role.value,
    platform: platform.value,
  });

  loadJobs();
});

// Load jobs
async function loadJobs() {
  const { data } = await supabaseClient
    .from("applications")
    .select("*");

  const tbody = document.getElementById("jobs");
  if (!tbody) return;

  tbody.innerHTML = "";
  data.forEach((job) => {
    tbody.innerHTML += `
      <tr>
        <td>${job.company}</td>
        <td>${job.role}</td>
        <td>${job.platform}</td>
      </tr>
    `;
  });
}

// Logout
async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}
