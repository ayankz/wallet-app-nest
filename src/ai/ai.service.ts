import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { CategoryService } from 'src/category/category.service';

export interface TransactionDto {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  date?: string;
  description?: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;

  constructor(private readonly categoryService: CategoryService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async extractTransactions(text: string): Promise<any> {
    try {
      const prompt = `
        Ты ассистент для извлечения транзакций из текста выписки.
        Выводи строго JSON массив:
        [
          {
            "type": "INCOME" | "EXPENSE",
            "amount": число,
            "date": "YYYY-MM-DD" (если есть),
            "description": "текстовое описание"
          }
        ]
        Текст для анализа: """${text}"""
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Ты помощник по анализу банковских выписок',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0,
      });

      let content = response.choices[0].message?.content;
      content = content!.replace(/```json|```/g, '').trim();
      if (!content) return [];
      console.log('📄 RAW AI RESPONSE:\n', content);

      // Пытаемся распарсить JSON из ответа
      const transactions: any = JSON.parse(content);
      return transactions;
    } catch (err) {
      this.logger.error('Ошибка при извлечении транзакций', err);
      return [];
    }
  }
}
