import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CriteriaSection {
  title: string;
  icon: string;
  points: string[];
}

@Component({
  selector: 'app-reading-criteria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reading-criteria.component.html',
  styleUrl: './reading-criteria.component.scss'
})
export class ReadingCriteriaComponent {
  criteriaSections: CriteriaSection[] = [
    {
      title: 'Fluency and Accuracy',
      icon: 'icon-criteria-1.svg',
      points: [
        'Reads text smoothly and with appropriate expression',
        'Maintains consistent reading speed',
        'Pronounces words accurately',
        'Recognizes and reads high-frequency words automatically',
        'Self-corrects when making mistakes'
      ]
    },
    {
      title: 'Comprehension Skills',
      icon: 'icon-criteria-2.svg',
      points: [
        'Understands main ideas and supporting details',
        'Makes logical predictions about the text',
        'Identifies cause and effect relationships',
        'Draws conclusions from the text',
        'Connects text to personal experiences'
      ]
    },
    {
      title: 'Vocabulary Development',
      icon: 'icon-criteria-3.svg',
      points: [
        'Uses context clues to understand new words',
        'Recognizes and understands grade-level vocabulary',
        'Identifies word relationships and meanings',
        'Uses new vocabulary appropriately',
        'Understands multiple meaning words'
      ]
    },
    {
      title: 'Reading Strategies',
      icon: 'icon-criteria-4.svg',
      points: [
        'Uses phonetic strategies for unknown words',
        'Applies appropriate decoding skills',
        'Monitors own comprehension',
        'Uses visualization techniques',
        'Applies different reading speeds when needed'
      ]
    },
    {
      title: 'Critical Thinking',
      icon: 'icon-criteria-5.svg',
      points: [
        'Analyzes characters and their motivations',
        'Evaluates author`s purpose and perspective',
        'Makes inferences from the text',
        'Distinguishes fact from opinion',
        'Identifies themes and main messages'
      ]
    },
    {
      title: 'Reading Engagement',
      icon: 'icon-criteria-6.svg',
      points: [
        'Shows interest in various text types',
        'Participates actively in reading discussions',
        'Sets personal reading goals',
        'Demonstrates reading stamina',
        'Chooses appropriate reading materials'
      ]
    }
  ];
} 