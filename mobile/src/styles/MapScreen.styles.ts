import { StyleSheet, Platform } from 'react-native';
import { Colors, FontSize, Spacing, Radius, Shadow } from './theme';

export default StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: Colors.bgPrimary,
  },

  // ── Header ──
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop:        Spacing.md,
    paddingBottom:     Spacing.md,
    backgroundColor:   Colors.bgPrimary,
  },
  headerTitle: {
    fontSize:   FontSize['2xl'],
    fontWeight: '800',
    color:      Colors.navy,
  },
  headerBtn: {
    width:           40,
    height:          40,
    borderRadius:    Radius.sm,
    backgroundColor: Colors.teal,
    alignItems:      'center',
    justifyContent:  'center',
    ...Shadow.teal,
  },

  // ── Mode Banner ──
  modeBanner: {
    alignSelf:         'center',
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   Colors.teal,
    borderRadius:      Radius.full,
    paddingVertical:   7,
    paddingHorizontal: Spacing.lg,
    marginBottom:      Spacing.sm,
    ...Shadow.teal,
  },
  modeDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: '#6EE7B7',
    marginRight:     Spacing.sm,
  },
  modeBannerText: {
    color:      '#fff',
    fontSize:   FontSize.sm,
    fontWeight: '700',
  },

  // ── Search (floating pill, Google Maps style) ──
  searchWrap: {
    marginHorizontal: Spacing.lg,
    marginTop:        Spacing.sm,
    marginBottom:     Spacing.sm,
  },
  searchBar: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   Colors.bgWhite,
    borderRadius:      Radius.full,
    paddingVertical:   12,
    paddingHorizontal: Spacing.md,
    ...Shadow.lg,
  },
  searchInput: {
    flex:       1,
    fontSize:   FontSize.md,
    color:      Colors.navy,
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },

  // ── Route Pills ──
  pillsRow: {
    flexDirection:     'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical:   Spacing.sm,
    flexWrap:          'wrap',
    gap:               Spacing.sm,
  },
  pill: {
    flexDirection:     'row',
    alignItems:        'center',
    borderRadius:      Radius.full,
    paddingVertical:   6,
    paddingHorizontal: 12,
    gap:               6,
  },
  pillDot: {
    width:        10,
    height:       10,
    borderRadius: 5,
  },
  pillText: {
    fontSize:   FontSize.sm,
    fontWeight: '700',
  },

  // ── AI Loading ──
  aiLoadingWrap: {
    marginHorizontal: Spacing.lg,
    marginBottom:     Spacing.sm,
    backgroundColor:  Colors.tealLight,
    borderRadius:     Radius.md,
    padding:          Spacing.md,
    flexDirection:    'row',
    alignItems:       'center',
    gap:              Spacing.sm,
  },
  aiLoadingText: {
    fontSize:   FontSize.sm,
    color:      Colors.tealDark,
    fontWeight: '600',
    flex:       1,
  },

  locateBtn: {
    width:           44,
    height:          44,
    borderRadius:    22,
    backgroundColor: Colors.bgWhite,
    alignItems:      'center',
    justifyContent:  'center',
    ...Shadow.md,
  },
});