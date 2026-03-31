export const rankJobs = (jobs: any[], aiData: any) => {
  const {
    experienceLevel,
    matching_job_titles,
    skills,
    preferred_locations,
    preferred_work_modes,
    preferred_work_types,
    primary_category
  } = aiData;

  return jobs.map((job) => {
    let score = 0;
    let maxScore = 0;

    // ----------------------
    // 1. TITLE MATCH (8)
    // ----------------------
    maxScore += 8;
    const titleMatch = matching_job_titles.some((title: string) =>
      job.title.toLowerCase().includes(title.toLowerCase())
    );
    if (titleMatch) score += 8;

    // ----------------------
    // 2. CATEGORY MATCH (5)
    // ----------------------
    maxScore += 5;
    if (
      job.category?.toLowerCase().includes(primary_category.toLowerCase())
    ) {
      score += 5;
    }

    // ----------------------
    // 3. SKILLS MATCH (3 per skill)
    // ----------------------
    const jobSkills = job.skills || [];

    const matchedSkills = jobSkills.filter((skill: string) =>
      skills.some((s: string) =>
        skill.toLowerCase().includes(s.toLowerCase())
      )
    );

    score += matchedSkills.length * 3;
    maxScore += jobSkills.length * 3;

    // ----------------------
    // 4. EXPERIENCE (5)
    // ----------------------
    maxScore += 5;
    if (job.experienceLevel === experienceLevel) {
      score += 5;
    }

    // ----------------------
    // 5. LOCATION (3)
    // ----------------------
    maxScore += 3;
    if (
      preferred_locations.length &&
      preferred_locations.includes(job.location)
    ) {
      score += 3;
    }

    // ----------------------
    // 6. WORK MODE (3)
    // ----------------------
    maxScore += 3;
    if (preferred_work_modes.includes(job.workMode)) {
      score += 3;
    }

    // ----------------------
    // 7. WORK TYPE (2)
    // ----------------------
    maxScore += 2;
    if (preferred_work_types.includes(job.workType)) {
      score += 2;
    }

    // ----------------------
    // FINAL %
    // ----------------------
    const matchPercentage = Math.round((score / maxScore) * 100);

    // LABEL
    let label = "Low Match";
    if (matchPercentage >= 85) label = "🔥 Top Match";
    else if (matchPercentage >= 70) label = "Good Match";
    else if (matchPercentage >= 50) label = "Average Match";

    return {
      ...job.toObject(),
      score,
      matchPercentage,
      matchedSkills,
      label
    };
  })
  .sort((a, b) => b.score - a.score);
};