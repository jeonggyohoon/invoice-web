import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { getNotionClient, getDbIds } from './client';
import {
  extractRelationIds,
  transformQuotePage,
  transformQuoteItemPage,
} from './transforms';
import type { IQuote, IQuoteItem } from '@/lib/types/quote';
import type { INotionInvoiceProperties } from '@/lib/types/notion';

// 회사 정보 (환경설정 또는 고정값)
const COMPANY_INFO = {
  name: '테크 스튜디오',
  address: '서울특별시 강남구 테헤란로 123',
  contact: 'contact@techstudio.kr',
};

/**
 * UUID(페이지 ID)로 견적서를 조회합니다.
 * 관련된 항목들도 함께 조회하여 반환합니다.
 */
export async function getQuoteByUUID(uuid: string): Promise<IQuote | null> {
  const notion = getNotionClient();
  const { quoteItemsDbId } = getDbIds();

  try {
    // 페이지 ID로 직접 조회
    const page = await notion.pages.retrieve({ page_id: uuid });

    // 아카이브된 페이지는 제외
    if ('archived' in page && page.archived) {
      return null;
    }

    // PageObjectResponse 타입 확인
    if (!('properties' in page)) {
      return null;
    }

    const pageResponse = page as PageObjectResponse;
    const props = pageResponse.properties as unknown as INotionInvoiceProperties;

    // 관련 항목 ID 추출
    const itemIds = extractRelationIds(props['항목']);

    // 항목들 병렬 조회
    const items: IQuoteItem[] = [];
    if (itemIds.length > 0) {
      const itemPromises = itemIds.map(async (itemId) => {
        try {
          const itemPage = await notion.pages.retrieve({ page_id: itemId });
          if ('properties' in itemPage && !('archived' in itemPage && itemPage.archived)) {
            return transformQuoteItemPage(itemPage as PageObjectResponse);
          }
          return null;
        } catch {
          return null;
        }
      });

      const itemResults = await Promise.all(itemPromises);
      items.push(...itemResults.filter((item): item is IQuoteItem => item !== null));
    }

    // 견적서 데이터 변환
    const quote = transformQuotePage(pageResponse, items);

    // 회사 정보 추가
    quote.companyName = COMPANY_INFO.name;
    quote.companyAddress = COMPANY_INFO.address;
    quote.companyContact = COMPANY_INFO.contact;

    return quote;
  } catch (error) {
    // 페이지를 찾을 수 없거나 권한이 없는 경우
    console.error('견적서 조회 실패:', error);
    return null;
  }
}

/**
 * 견적서 번호로 견적서를 조회합니다.
 * 데이터베이스에서 견적서 번호가 일치하는 페이지를 찾습니다.
 */
export async function getQuoteByNumber(quoteNumber: string): Promise<IQuote | null> {
  const notion = getNotionClient();
  const { quotesDbId, quoteItemsDbId } = getDbIds();

  try {
    // 데이터베이스에서 견적서 번호로 검색
    const response = await notion.databases.query({
      database_id: quotesDbId,
      filter: {
        property: '견적서 번호',
        title: {
          equals: quoteNumber,
        },
      },
      page_size: 1,
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0] as PageObjectResponse;

    if (page.archived) {
      return null;
    }

    const props = page.properties as unknown as INotionInvoiceProperties;

    // 관련 항목 ID 추출
    const itemIds = extractRelationIds(props['항목']);

    // 항목들 병렬 조회
    const items: IQuoteItem[] = [];
    if (itemIds.length > 0) {
      const itemPromises = itemIds.map(async (itemId) => {
        try {
          const itemPage = await notion.pages.retrieve({ page_id: itemId });
          if ('properties' in itemPage && !('archived' in itemPage && itemPage.archived)) {
            return transformQuoteItemPage(itemPage as PageObjectResponse);
          }
          return null;
        } catch {
          return null;
        }
      });

      const itemResults = await Promise.all(itemPromises);
      items.push(...itemResults.filter((item): item is IQuoteItem => item !== null));
    }

    // 견적서 데이터 변환
    const quote = transformQuotePage(page, items);

    // 회사 정보 추가
    quote.companyName = COMPANY_INFO.name;
    quote.companyAddress = COMPANY_INFO.address;
    quote.companyContact = COMPANY_INFO.contact;

    return quote;
  } catch (error) {
    console.error('견적서 조회 실패:', error);
    return null;
  }
}
