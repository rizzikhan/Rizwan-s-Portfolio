import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Get skills with their categories
    const { data: skillsWithCategories, error } = await supabase
      .from('skills')
      .select(`
        *,
        skill_categories (
          id,
          name,
          icon,
          sort_order
        )
      `)
      .eq('published', true)
      .eq('skill_categories.published', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch skills" },
        { status: 500 }
      );
    }

    // Group skills by category
    const skillsByCategory = (skillsWithCategories || []).reduce((acc, skill) => {
      const category = skill.skill_categories;
      if (!acc[category.name]) {
        acc[category.name] = {
          id: category.id,
          name: category.name,
          icon: category.icon,
          sort_order: category.sort_order,
          skills: []
        };
      }
      acc[category.name].skills.push({
        id: skill.id,
        name: skill.name,
        proficiency: skill.proficiency,
        years_experience: skill.years_experience,
        icon: skill.icon,
        sort_order: skill.sort_order
      });
      return acc;
    }, {} as Record<string, any>);

    // Convert to array and sort by category sort_order
    const categorizedSkills = Object.values(skillsByCategory).sort(
      (a: any, b: any) => a.sort_order - b.sort_order
    );

    return NextResponse.json({
      skills: categorizedSkills
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}